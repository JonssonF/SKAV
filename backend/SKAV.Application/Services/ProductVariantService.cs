using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.ProductVariant;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class ProductVariantService(
        IProductVariantRepository repo,
        IProductRepository productRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductVariantService
    {
        public async Task<CreateProductVariantResponseDto> CreateAsync(CreateProductVariantRequestDto request, CancellationToken ct)
        {
            var product = await productRepo.GetByIdAsync(request.ProductId, ct)
                ?? throw new NotFoundException(BusinessRules.ProductNotFound);

            var variant = new ProductVariant
            {
                ProductId = request.ProductId,
                Attributes = request.Attributes,
                PriceOverride = request.PriceOverride,
                StockQuantity = request.StockQuantity,
                Version = 1,
            };

            AuditHelper.SetCreated(variant, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(variant, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateProductVariantResponseDto { Id = id };
        }

        public async Task<UpdateProductVariantResponseDto> UpdateAsync(int id, UpdateProductVariantRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductVariantNotFound);

            existing.Attributes = request.Attributes;
            existing.PriceOverride = request.PriceOverride;
            existing.StockQuantity = request.StockQuantity;

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var affected = await repo.UpdateWithVersionCheckAsync(existing, ct);
            if (affected == 0)
                throw new BusinessRuleException(
                    "Varianten har ändrats av någon annan. Ladda om och försök igen.",
                    BusinessRules.ProductConcurrencyError);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateProductVariantResponseDto();
        }

        public async Task<DeleteProductVariantResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductVariantNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteProductVariantResponseDto();
        }
    }
}