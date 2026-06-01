using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Product;
using SKAV.Application.DTOs.ProductImage;
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
        IProductVariantRepository variantRepo,
        IProductAttributeDefinitionRepository attrRepo,
        IProductImageRepository imageRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductService
    {
        public async Task<IEnumerable<ProductResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var products = await repo.GetAllAsync(ct);
            var result = new List<ProductResponseDto>();

            foreach (var product in products)
            {
                var variants = await variantRepo.GetByProductIdAsync(product.Id, ct);
                var attributes = await attrRepo.GetByProductIdAsync(product.Id, ct);
                var images = await imageRepo.GetByProductIdAsync(product.Id, ct);
                result.Add(MapToDto(product, variants, attributes, images));
            }

            return result;
        }

        public async Task<ProductResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var product = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductNotFound);

            var variants = await variantRepo.GetByProductIdAsync(product.Id, ct);
            var attributes = await attrRepo.GetByProductIdAsync(product.Id, ct);
            var images = await imageRepo.GetByProductIdAsync(product.Id, ct);

            return MapToDto(product, variants, attributes, images);
        }

        public async Task<CreateProductResponseDto> CreateAsync(CreateProductRequestDto request, CancellationToken ct)
        {
            var product = new Product
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                Category = request.Category,
                IsSignable = request.IsSignable,
                SigningPrice = request.SigningPrice,
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
            existing.Category = request.Category;
            existing.IsSignable = request.IsSignable;
            existing.SigningPrice = request.SigningPrice;

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
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

        private static ProductResponseDto MapToDto(
        Product p,
        IEnumerable<ProductVariant> variants,
        IEnumerable<ProductAttributeDefinition> attributes,
        IEnumerable<ProductImage> images) => new()
        {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                Category = p.Category,
                IsSignable = p.IsSignable,
                SigningPrice = p.SigningPrice,
                Images = images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ImageUrl = i.ImageUrl,
                    IsPrimary = i.IsPrimary,
                    DisplayOrder = i.DisplayOrder,
                }).ToList(),
                AttributeDefinitions = attributes.OrderBy(a => a.DisplayOrder).Select(a => new ProductAttributeDefinitionDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    AttributeValues = a.AttributeValues,
                    DisplayOrder = a.DisplayOrder,
                }).ToList(),
                Variants = variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    Attributes = v.Attributes,
                    PriceOverride = v.PriceOverride,
                    StockQuantity = v.StockQuantity,
                }).ToList(),
        };

        public async Task<IEnumerable<string>> GetCategoriesAsync(CancellationToken ct)
        {
            var products = await repo.GetAllAsync(ct);

            return products
                .Where(p => !string.IsNullOrWhiteSpace(p.Category))
                .Select(p => p.Category!)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(c => c)
                .ToList();
        }
    }
}