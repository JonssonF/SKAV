using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Gigs;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/gigs")]
    [ApiController]
    public class GigsController(IGigService service) : ControllerBase
    {

        [HttpGet]
        [SwaggerOperation("Hämtar alla gigs")]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await service.GetAllAsync(ct));

        [HttpGet("{id}")]
        [SwaggerOperation("Hämtar en gig baserat på ID")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
            => Ok(await service.GetByIdAsync(id, ct));

        [HttpPost]
        [SwaggerOperation("Skapar ett nytt gig")]
        public async Task<IActionResult> Create(CreateGigRequestDto request, CancellationToken ct)
        {
            var id = await service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id }, null);
        }

        [HttpPut("{id}")]
        [SwaggerOperation("Uppdaterar ett befintligt gig")]
        public async Task<IActionResult> Update(int id, UpdateGigRequestDto request, CancellationToken ct)
        {
            await service.UpdateAsync(id, request, ct);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [SwaggerOperation("Tar bort ett befintligt gig")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            await service.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}
