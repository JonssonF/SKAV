using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Subscriber;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/subscribers")]
    [ApiController]
    public class SubscriberController(ISubscriberService subscriberService) : ControllerBase
    {
        [HttpPost]
        public async Task<SubscribeResponseDto> Subscribe(
            SubscribeRequestDto request, CancellationToken ct)
            => await subscriberService.SubscribeAsync(request, ct);

        [HttpDelete]
        public async Task<UnsubscribeResponseDto> Unsubscribe(
            SubscribeRequestDto request, CancellationToken ct)
            => await subscriberService.UnsubscribeAsync(request, ct);
    }
}
