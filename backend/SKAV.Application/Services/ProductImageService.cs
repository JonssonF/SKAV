using SKAV.Application.Common.Helpers;
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
    public class ProductImageService(
        IProductImageRepository repo,
        IProductRepository productRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductImageService
    {
        public async Task<CreateProductImageResponseDto> CreateAsync(
            CreateProductImageRequestDto request, CancellationToken ct)
        {
            var product = await productRepo.GetByIdAsync(request.ProductId, ct)
                ?? throw new NotFoundException(BusinessRules.ProductNotFound);

            var existingImages = await repo.GetByProductIdAsync(request.ProductId, ct);

            var image = new ProductImage
            {
                ProductId = request.ProductId,
                ImageUrl = request.ImageUrl,
                IsPrimary = request.IsPrimary || !existingImages.Any(),
                DisplayOrder = request.DisplayOrder,
            };

            if (image.IsPrimary)
            {
                await ClearPrimaryAsync(request.ProductId, null, ct);
            }

            AuditHelper.SetCreated(image, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(image, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateProductImageResponseDto { Id = id };
        }

        public async Task<UpdateProductImageResponseDto> UpdateAsync(
            int id, UpdateProductImageRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductImageNotFound);

            existing.ImageUrl = request.ImageUrl;
            existing.IsPrimary = request.IsPrimary;
            existing.DisplayOrder = request.DisplayOrder;

            if (existing.IsPrimary)
            {
                await ClearPrimaryAsync(existing.ProductId, id, ct);
            }

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateProductImageResponseDto();
        }

        public async Task<DeleteProductImageResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductImageNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteProductImageResponseDto();
        }

        private async Task ClearPrimaryAsync(int productId, int? excludeId, CancellationToken ct)
        {
            var images = await repo.GetByProductIdAsync(productId, ct);

            using var scope = uow.BeginTransactionScope();
            foreach (var img in images.Where(i => i.IsPrimary && i.Id != excludeId))
            {
                img.IsPrimary = false;
                AuditHelper.SetUpdated(img, currentUser.UserId);
                await repo.UpdateAsync(img, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }
    }
}