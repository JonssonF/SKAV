using SKAV.Application.DTOs.Subscriber;

namespace SKAV.Application.Services.Interface
{
    public interface ISubscriberService
    {
        Task<SubscriberResponseDto> SubscribeAsync(SubscriberRequestDto request, CancellationToken ct);
        Task<UnsubscribeResponseDto> UnsubscribeAsync(SubscriberRequestDto request, CancellationToken ct);
        Task<IEnumerable<SubscriberResponseDto>> GetAllAsync(CancellationToken ct);
    }
}
