using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Newsletter;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/newsletter")]
    [ApiController]
    [Authorize(Roles = "Admin,Editor")]
    public class NewsletterController(INewsletterService service) : ControllerBase
    {
        [HttpPost]
        [SwaggerOperation("Skickar nyhetsbrev till alla prenumeranter")]
        public async Task<SendNewsletterResponseDto> Send(SendNewsletterRequestDto request, CancellationToken ct)
            => await service.SendAsync(request, ct);

        [HttpPost("preview")]
        [SwaggerOperation("Returnerar HTML-förhandsgranskning av nyhetsbrev")]
        public PreviewNewsletterResponseDto Preview(PreviewNewsletterRequestDto request)
        => service.Preview(request);
    }
}
