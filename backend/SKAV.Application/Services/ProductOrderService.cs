using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.ProductOrder;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class ProductOrderService(
        IProductOrderRepository orderRepo,
        IProductOrderItemRepository itemRepo,
        IProductRepository productRepo,
        IUserRepository userRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductOrderService
    {
        public async Task<IEnumerable<ProductOrderResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var orders = await orderRepo.GetAllAsync(ct);
            var products = await productRepo.GetAllAsync(ct);
            var users = await userRepo.GetAllAsync(ct);

            var productLookup = products.ToDictionary(p => p.Id);
            var userLookup = users.ToDictionary(u => u.Id, u => u.Email);

            var result = new List<ProductOrderResponseDto>();

            foreach (var order in orders.OrderByDescending(o => o.CreatedAt))
            {
                var items = await itemRepo.GetByOrderIdAsync(order.Id, ct);
                result.Add(MapToDto(order, items, productLookup, userLookup));
            }

            return result;
        }

        public async Task<ProductOrderResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var order = await orderRepo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductOrderNotFound);

            var items = await itemRepo.GetByOrderIdAsync(order.Id, ct);
            var products = await productRepo.GetAllAsync(ct);
            var users = await userRepo.GetAllAsync(ct);

            var productLookup = products.ToDictionary(p => p.Id);
            var userLookup = users.ToDictionary(u => u.Id, u => u.Email);

            return MapToDto(order, items, productLookup, userLookup);
        }

        public async Task<CreateProductOrderResponseDto> CreateAsync(CreateProductOrderRequestDto request, CancellationToken ct)
        {
            // Validera att alla produkter finns och har lager
            var productsToUpdate = new List<Product>();

            foreach (var item in request.Items)
            {
                var product = await productRepo.GetByIdAsync(item.ProductId, ct)
                    ?? throw new NotFoundException(BusinessRules.ProductNotFound);

                if (product.StockQuantity < item.Quantity)
                    throw new BusinessRuleException(
                        $"{product.Title} har bara {product.StockQuantity} i lager.",
                        BusinessRules.ProductOutOfStock);

                product.StockQuantity -= item.Quantity;
                productsToUpdate.Add(product);
            }

            var order = new ProductOrder
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Message = request.Message,
                IsHandled = false,
            };

            AuditHelper.SetCreated(order, null);

            using var scope = uow.BeginTransactionScope();

            // Skapa ordern
            var orderId = await orderRepo.CreateAsync(order, ct);

            // Skapa order items
            foreach (var item in request.Items)
            {
                var orderItem = new ProductOrderItem
                {
                    ProductOrderId = orderId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                };

                AuditHelper.SetCreated(orderItem, null);
                await itemRepo.CreateAsync(orderItem, ct);
            }

            // Minska lagersaldo med version check
            foreach (var product in productsToUpdate)
            {
                AuditHelper.SetUpdated(product, null);
                var affected = await productRepo.UpdateWithVersionCheckAsync(product, ct);
                if (affected == 0)
                    throw new BusinessRuleException(
                        $"Kunde inte uppdatera lagersaldo för {product.Title}. Försök igen.",
                        BusinessRules.ProductConcurrencyError);
            }

            await scope.CommitTransactionScopeAsync(ct);

            return new CreateProductOrderResponseDto { Id = orderId };
        }

        public async Task<HandleProductOrderResponseDto> HandleAsync(int id, CancellationToken ct)
        {
            var order = await orderRepo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductOrderNotFound);

            order.IsHandled = true;
            order.HandledAt = DateTime.UtcNow;
            order.HandledBy = currentUser.UserId;

            using var scope = uow.BeginTransactionScope();
            await orderRepo.UpdateAsync(order, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new HandleProductOrderResponseDto();
        }

        private static ProductOrderResponseDto MapToDto(
            ProductOrder order,
            IEnumerable<ProductOrderItem> items,
            Dictionary<int, Product> productLookup,
            Dictionary<int, string> userLookup) => new()
            {
                Id = order.Id,
                Name = order.Name,
                Email = order.Email,
                Phone = order.Phone,
                Message = order.Message,
                IsHandled = order.IsHandled,
                HandledAt = order.HandledAt,
                HandledBy = order.HandledBy,
                HandledByEmail = order.HandledBy.HasValue && userLookup.ContainsKey(order.HandledBy.Value)
                ? userLookup[order.HandledBy.Value]
                : null,
                CreatedAt = order.CreatedAt,
                Items = items.Select(i => new ProductOrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductTitle = productLookup.ContainsKey(i.ProductId)
                        ? productLookup[i.ProductId].Title
                        : "Okänd produkt",
                    ProductPrice = productLookup.ContainsKey(i.ProductId)
                        ? productLookup[i.ProductId].Price
                        : 0,
                    Quantity = i.Quantity,
                }).ToList(),
            };
    }
}