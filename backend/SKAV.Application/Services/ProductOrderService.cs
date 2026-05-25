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
        IProductVariantRepository variantRepo,
        IUserRepository userRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductOrderService
    {
        public async Task<IEnumerable<ProductOrderResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var orders = await orderRepo.GetAllAsync(ct);
            var products = await productRepo.GetAllAsync(ct);
            var variants = await variantRepo.GetAllAsync(ct);
            var users = await userRepo.GetAllAsync(ct);

            var productLookup = products.ToDictionary(p => p.Id);
            var variantLookup = variants.ToDictionary(v => v.Id);
            var userLookup = users.ToDictionary(u => u.Id, u => u.Email);

            var result = new List<ProductOrderResponseDto>();

            foreach (var order in orders.OrderByDescending(o => o.CreatedAt))
            {
                var items = await itemRepo.GetByOrderIdAsync(order.Id, ct);
                result.Add(MapToDto(order, items, productLookup, variantLookup, userLookup));
            }

            return result;
        }

        public async Task<ProductOrderResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var order = await orderRepo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductOrderNotFound);

            var items = await itemRepo.GetByOrderIdAsync(order.Id, ct);
            var products = await productRepo.GetAllAsync(ct);
            var variants = await variantRepo.GetAllAsync(ct);
            var users = await userRepo.GetAllAsync(ct);

            var productLookup = products.ToDictionary(p => p.Id);
            var variantLookup = variants.ToDictionary(v => v.Id);
            var userLookup = users.ToDictionary(u => u.Id, u => u.Email);

            return MapToDto(order, items, productLookup, variantLookup, userLookup);
        }

        public async Task<CreateProductOrderResponseDto> CreateAsync(CreateProductOrderRequestDto request, CancellationToken ct)
        {
            var variantsToUpdate = new List<ProductVariant>();

            foreach (var item in request.Items)
            {
                var variant = await variantRepo.GetByIdAsync(item.ProductVariantId, ct)
                    ?? throw new NotFoundException(BusinessRules.ProductVariantNotFound);

                if (variant.StockQuantity < item.Quantity)
                {
                    var product = await productRepo.GetByIdAsync(variant.ProductId, ct);
                    throw new BusinessRuleException(
                        $"{product?.Title ?? "Produkt"} har bara {variant.StockQuantity} i lager.",
                        BusinessRules.ProductOutOfStock);
                }

                variant.StockQuantity -= item.Quantity;
                variantsToUpdate.Add(variant);
            }

            var order = new ProductOrder
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Message = request.Message,
                Address = request.Address,
                City = request.City,
                PostalCode = request.PostalCode,
                IsHandled = false,
                IsCancelled = false,
            };

            AuditHelper.SetCreated(order, null);

            using var scope = uow.BeginTransactionScope();

            var orderId = await orderRepo.CreateAsync(order, ct);

            foreach (var item in request.Items)
            {
                var variant = variantsToUpdate.First(v => v.Id == item.ProductVariantId);
                var product = await productRepo.GetByIdAsync(variant.ProductId, ct)
                    ?? throw new NotFoundException(BusinessRules.ProductNotFound);

                if (item.IsSigned && !product.IsSignable)
                    throw new BusinessRuleException(
                        $"{product.Title} kan inte signeras.",
                        BusinessRules.ProductNotSignable);

                var orderItem = new ProductOrderItem
                {
                    ProductOrderId = orderId,
                    ProductId = variant.ProductId,
                    ProductVariantId = item.ProductVariantId,
                    Quantity = item.Quantity,
                    IsSigned = item.IsSigned,
                };

                AuditHelper.SetCreated(orderItem, null);
                await itemRepo.CreateAsync(orderItem, ct);
            }

            foreach (var variant in variantsToUpdate)
            {
                AuditHelper.SetUpdated(variant, null);
                var affected = await variantRepo.UpdateWithVersionCheckAsync(variant, ct);
                if (affected == 0)
                    throw new BusinessRuleException(
                        "Lagersaldo har ändrats. Försök igen.",
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

        public async Task<CancelProductOrderResponseDto> CancelAsync(int id, CancellationToken ct)
        {
            var order = await orderRepo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductOrderNotFound);

            if (order.IsCancelled)
                throw new BusinessRuleException(
                    "Beställningen är redan avbruten.",
                    BusinessRules.ProductOrderAlreadyCancelled);

            if (order.IsHandled)
                throw new BusinessRuleException(
                    "Beställningen är redan hanterad och kan inte avbrytas.",
                    BusinessRules.ProductOrderAlreadyHandled);

            // Hämta order items och lägg tillbaka lager
            var items = await itemRepo.GetByOrderIdAsync(order.Id, ct);

            order.IsCancelled = true;
            order.CancelledAt = DateTime.UtcNow;
            order.CancelledBy = currentUser.UserId;

            using var scope = uow.BeginTransactionScope();

            await orderRepo.UpdateAsync(order, ct);

            foreach (var item in items)
            {
                var variant = await variantRepo.GetByIdAsync(item.ProductVariantId, ct);
                if (variant != null)
                {
                    variant.StockQuantity += item.Quantity;
                    AuditHelper.SetUpdated(variant, currentUser.UserId);
                    var affected = await variantRepo.UpdateWithVersionCheckAsync(variant, ct);
                    if (affected == 0)
                        throw new BusinessRuleException(
                            "Kunde inte uppdatera lagersaldo. Försök igen.",
                            BusinessRules.ProductConcurrencyError);
                }
            }

            await scope.CommitTransactionScopeAsync(ct);

            return new CancelProductOrderResponseDto();
        }

        private static ProductOrderResponseDto MapToDto(
            ProductOrder order,
            IEnumerable<ProductOrderItem> items,
            Dictionary<int, Product> productLookup,
            Dictionary<int, ProductVariant> variantLookup,
            Dictionary<int, string> userLookup) => new()
            {
                Id = order.Id,
                Name = order.Name,
                Email = order.Email,
                Phone = order.Phone,
                Address = order.Address,
                City = order.City,
                PostalCode = order.PostalCode,
                Message = order.Message,
                IsHandled = order.IsHandled,
                HandledAt = order.HandledAt,
                HandledBy = order.HandledBy,
                HandledByEmail = order.HandledBy.HasValue && userLookup.ContainsKey(order.HandledBy.Value)
                ? userLookup[order.HandledBy.Value]
                : null,
                IsCancelled = order.IsCancelled,
                CancelledAt = order.CancelledAt,
                CancelledBy = order.CancelledBy,
                CancelledByEmail = order.CancelledBy.HasValue && userLookup.ContainsKey(order.CancelledBy.Value)
                ? userLookup[order.CancelledBy.Value]
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
                    ProductVariantId = i.ProductVariantId,
                    VariantAttributes = variantLookup.ContainsKey(i.ProductVariantId)
                        ? variantLookup[i.ProductVariantId].Attributes
                        : "{}",
                    Quantity = i.Quantity,
                    IsSigned = i.IsSigned,
                    SigningPrice = i.IsSigned && productLookup.ContainsKey(i.ProductId)
                        ? productLookup[i.ProductId].SigningPrice
                        : null,
                }).ToList(),
            };
    }
}