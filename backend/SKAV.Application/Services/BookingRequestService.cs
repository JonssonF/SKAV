using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.BookingRequest;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validators.BookingRequest;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class BookingRequestService(
        IBookingRequestRepository repo,
        IBookingRecipientRepository recipientRepo,
        ICurrentUserService currentUser,
        IUserRepository userRepo,
        IUnitOfWork uow) : IBookingRequestService
    {
        public async Task<IEnumerable<BookingRequestResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var requests = await repo.GetAllAsync(ct);
            var users = await userRepo.GetAllAsync(ct);
            var userLookup = users.ToDictionary(u => u.Id, u => u.Email);

            return requests
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => MapToDto(r, userLookup));
        }

        public async Task<BookingRequestResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var request = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.BookingRequestNotFound);

            string? answeredByEmail = null;
            if (request.AnsweredBy.HasValue)
            {
                var answeredUser = await userRepo.GetByIdAsync(request.AnsweredBy.Value, ct);
                answeredByEmail = answeredUser?.Email;
            }

            return MapToDto(request, answeredByEmail);
        }

        public async Task<CreateBookingRequestResponseDto> CreateAsync(CreateBookingRequestDto request, CancellationToken ct)
        {
            var bookingRequest = new BookingRequest
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                EventDate = request.EventDate,
                EventType = request.EventType,
                Message = request.Message,
                IsRead = false,
            };

            AuditHelper.SetCreated(bookingRequest, null);
            if (bookingRequest.EventDate.HasValue)
            {
                BookingRequestValidator.ValidateDate(bookingRequest.EventDate.Value);
            }

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(bookingRequest, ct);
            await scope.CommitTransactionScopeAsync(ct);

            // TODO: Skicka mailnotis till alla recipients via Resend
            // var recipients = await recipientRepo.GetAllAsync(ct);
            // await emailService.SendBookingNotification(recipients, bookingRequest);

            return new CreateBookingRequestResponseDto { Id = id };
        }

        public async Task<MarkBookingReadResponseDto> MarkAsReadAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.BookingRequestNotFound);

            existing.IsRead = true;
            existing.AnsweredAt = DateTimeOffset.UtcNow;
            existing.AnsweredBy = currentUser.UserId;

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new MarkBookingReadResponseDto();
        }

        private static BookingRequestResponseDto MapToDto(BookingRequest r, Dictionary<int, string> userLookup) =>
            MapToDto(r, r.AnsweredBy.HasValue && userLookup.ContainsKey(r.AnsweredBy.Value)
                ? userLookup[r.AnsweredBy.Value]
                : null);

        private static BookingRequestResponseDto MapToDto(BookingRequest r, string? answeredByEmail = null) => new()
        {
            Id = r.Id,
            Name = r.Name,
            Email = r.Email,
            Phone = r.Phone,
            EventDate = r.EventDate,
            EventType = r.EventType,
            Message = r.Message,
            IsRead = r.IsRead,
            AnsweredAt = r.AnsweredAt,
            AnsweredBy = r.AnsweredBy,
            AnsweredByEmail = answeredByEmail,
            CreatedAt = r.CreatedAt,
        };
    }
}