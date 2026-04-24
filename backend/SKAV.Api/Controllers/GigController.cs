using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Gigs;
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
        public async Task<IEnumerable<GigResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [SwaggerOperation("Hämtar en gig baserat på ID")]
        public async Task<GigResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [SwaggerOperation("Skapar ett nytt gig")]
        public async Task<CreateGigResponseDto> Create(CreateGigRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [SwaggerOperation("Uppdaterar ett befintligt gig")]
        public async Task<UpdateGigResponseDto> Update(int id, UpdateGigRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Tar bort ett befintligt gig")]
        public async Task<DeleteGigResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}
