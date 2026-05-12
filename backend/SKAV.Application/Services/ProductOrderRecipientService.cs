using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.ProductOrderNotificationRecipient;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class ProductOrderRecipientService(
        IProductOrderRecipientRepository repo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IProductOrderRecipientService
    {
        public async Task<IEnumerable<ProductOrderRecipientResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var recipients = await repo.GetAllAsync(ct);
            return recipients.Select(MapToDto);
        }

        public async Task<CreateProductOrderRecipientResponseDto> CreateAsync(CreateProductOrderRecipientRequestDto request, CancellationToken ct)
        {
            var exists = await repo.ExistsByEmailAsync(request.Email, ct);
            if (exists)
                throw new BusinessRuleException(
                    "E-postadressen finns redan i mottagarlistan.",
                    BusinessRules.ProductOrderRecipientAlreadyExists);

            var recipient = new ProductOrderNotificationRecipient
            {
                Email = request.Email,
                MemberId = request.MemberId,
            };

            AuditHelper.SetCreated(recipient, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(recipient, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateProductOrderRecipientResponseDto { Id = id };
        }

        public async Task<DeleteProductOrderRecipientResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.ProductOrderRecipientNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteProductOrderRecipientResponseDto();
        }

        private static ProductOrderRecipientResponseDto MapToDto(ProductOrderNotificationRecipient r) => new()
        {
            Id = r.Id,
            Email = r.Email,
            MemberId = r.MemberId,
        };
    }
}