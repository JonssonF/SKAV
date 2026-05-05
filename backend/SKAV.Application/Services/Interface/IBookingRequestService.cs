using SKAV.Application.DTOs.BookingRequest;

namespace SKAV.Application.Services.Interface
{
    public interface IBookingRequestService
    {
        Task<IEnumerable<BookingRequestResponseDto>> GetAllAsync(CancellationToken ct);
        Task<BookingRequestResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateBookingRequestResponseDto> CreateAsync(CreateBookingRequestDto request, CancellationToken ct);
        Task<MarkBookingReadResponseDto> MarkAsReadAsync(int id, CancellationToken ct);
    }
}