using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.SiteSetting;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/site-settings")]
    [ApiController]
    public class SiteSettingsController(ISiteSettingService service) : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        [SwaggerOperation("Hämta alla inställningar")]
        public async Task<IEnumerable<SiteSettingResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpPut]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Uppdatera en inställning")]
        public async Task<UpdateSiteSettingResponseDto> Update(UpdateSiteSettingDto request, CancellationToken ct)
            => await service.UpdateAsync(request, ct);
    }
}