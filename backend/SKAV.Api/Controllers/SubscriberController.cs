using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Subscriber;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/subscribers")]
    [ApiController]
    public class SubscriberController(ISubscriberService subscriberService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation("Hämta alla prenumeranter")]
        public async Task<IEnumerable<SubscriberResponseDto>> GetAll(CancellationToken ct)
            => await subscriberService.GetAllAsync(ct);

        [HttpPost]
        [SwaggerOperation("Prenumerera på nyhetsbrev")]
        public async Task<SubscriberResponseDto> Subscribe(
            SubscriberRequestDto request, CancellationToken ct)
            => await subscriberService.SubscribeAsync(request, ct);

        [HttpDelete]
        [SwaggerOperation("Avsluta prenumeration på nyhetsbrev")]
        public async Task<UnsubscribeResponseDto> Unsubscribe(
            SubscriberRequestDto request, CancellationToken ct)
            => await subscriberService.UnsubscribeAsync(request, ct);
    }
}
