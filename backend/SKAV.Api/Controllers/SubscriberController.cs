using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Subscriber;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/subscribers")]
    [ApiController]
    public class SubscriberController(ISubscriberService subscriberService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IEnumerable<SubscriberResponseDto>> GetAll(CancellationToken ct)
            => await subscriberService.GetAllAsync(ct);

        [HttpPost]
        public async Task<SubscriberResponseDto> Subscribe(
            SubscriberRequestDto request, CancellationToken ct)
            => await subscriberService.SubscribeAsync(request, ct);

        [HttpDelete]
        public async Task<UnsubscribeResponseDto> Unsubscribe(
            SubscriberRequestDto request, CancellationToken ct)
            => await subscriberService.UnsubscribeAsync(request, ct);
    }
}
