using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.BookingNotificationRecipient;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class BookingRecipientService(
        IBookingRecipientRepository repo,
        IMemberRepository memberRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IBookingRecipientService
    {
        public async Task<IEnumerable<BookingRecipientResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var recipients = await repo.GetAllAsync(ct);
            return recipients.Select(MapToDto);
        }

        public async Task<CreateBookingRecipientResponseDto> CreateAsync(CreateBookingRecipientRequestDto request, CancellationToken ct)
        {
            var exists = await repo.ExistsByEmailAsync(request.Email, ct);
            if (exists)
                throw new BusinessRuleException(
                    "E-postadressen finns redan i mottagarlistan.",
                    BusinessRules.BookingRecipientAlreadyExists);

            if (request.MemberId.HasValue)
            {
                var memberExist = await memberRepo.ExistsAsync(request.MemberId.Value, ct);
                if (!memberExist)
                    throw new BusinessRuleException("Kunde inte hitta några medlemmar,",
                        BusinessRules.MemberNotFound);
            }

            var recipient = new BookingNotificationRecipient
            {
                Email = request.Email,
                MemberId = request.MemberId,
            };

            AuditHelper.SetCreated(recipient, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(recipient, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateBookingRecipientResponseDto { Id = id };
        }

        public async Task<DeleteBookingRecipientResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.BookingRecipientNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteBookingRecipientResponseDto();
        }

        private static BookingRecipientResponseDto MapToDto(BookingNotificationRecipient r) => new()
        {
            Id = r.Id,
            Email = r.Email,
            MemberId = r.MemberId,
        };
    }
}