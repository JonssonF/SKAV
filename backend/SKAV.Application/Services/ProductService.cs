using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Product;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class ProductService(
        IProductRepository repo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductService
    {
        public async Task<IEnumerable<ProductResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var products = await repo.GetAllAsync(ct);
            return products.Select(MapToDto);
        }

        public async Task<ProductResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var product = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductNotFound);
            return MapToDto(product);
        }

        public async Task<CreateProductResponseDto> CreateAsync(CreateProductRequestDto request, CancellationToken ct)
        {
            var product = new Product
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                ImageUrl = request.ImageUrl,
                Category = request.Category,
                StockQuantity = request.StockQuantity,
                Version = 1,
            };

            AuditHelper.SetCreated(product, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(product, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateProductResponseDto { Id = id };
        }

        public async Task<UpdateProductResponseDto> UpdateAsync(int id, UpdateProductRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductNotFound);

            existing.Title = request.Title;
            existing.Description = request.Description;
            existing.Price = request.Price;
            existing.ImageUrl = request.ImageUrl;
            existing.Category = request.Category;
            existing.StockQuantity = request.StockQuantity;

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var affected = await repo.UpdateWithVersionCheckAsync(existing, ct);
            if (affected == 0)
                throw new BusinessRuleException(
                    "Produkten har ändrats av någon annan. Ladda om och försök igen.",
                    BusinessRules.ProductConcurrencyError);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateProductResponseDto();
        }

        public async Task<DeleteProductResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteProductResponseDto();
        }

        private static ProductResponseDto MapToDto(Product p) => new()
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            Category = p.Category,
            StockQuantity = p.StockQuantity,
        };
    }
}