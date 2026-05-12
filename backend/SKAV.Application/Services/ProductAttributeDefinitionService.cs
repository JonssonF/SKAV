using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.ProductAttributeDefinition;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class ProductAttributeDefinitionService(
        IProductAttributeDefinitionRepository repo,
        IProductRepository productRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductAttributeDefinitionService
    {
        public async Task<CreateProductAttributeDefinitionResponseDto> CreateAsync(CreateProductAttributeDefinitionRequestDto request, CancellationToken ct)
        {
            var product = await productRepo.GetByIdAsync(request.ProductId, ct)
                ?? throw new NotFoundException(BusinessRules.ProductNotFound);

            var definition = new ProductAttributeDefinition
            {
                ProductId = request.ProductId,
                Name = request.Name,
                AttributeValues = request.AttributeValues,
                DisplayOrder = request.DisplayOrder,
            };

            AuditHelper.SetCreated(definition, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(definition, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateProductAttributeDefinitionResponseDto { Id = id };
        }

        public async Task<DeleteProductAttributeDefinitionResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductAttributeDefinitionNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteProductAttributeDefinitionResponseDto();
        }
    }
}