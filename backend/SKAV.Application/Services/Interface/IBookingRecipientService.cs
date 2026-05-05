using SKAV.Application.DTOs.BookingNotificationRecipient;

namespace SKAV.Application.Services.Interface
{
    public interface IBookingRecipientService
    {
        Task<IEnumerable<BookingRecipientResponseDto>> GetAllAsync(CancellationToken ct);
        Task<CreateBookingRecipientResponseDto> CreateAsync(CreateBookingRecipientRequestDto request, CancellationToken ct);
        Task<DeleteBookingRecipientResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}