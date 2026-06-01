using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Lyrics;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/lyrics")]
    [ApiController]
    public class LyricsController(ILyricsService service) : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation("Hämtar alla låttexter")]
        public async Task<IEnumerable<LyricsResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("by-song/{songId}")]
        [SwaggerOperation("Hämtar låttext baserat på låt-ID")]
        public async Task<LyricsResponseDto?> GetBySongId(int songId, CancellationToken ct)
            => await service.GetBySongIdAsync(songId, ct);

        [HttpGet("{slug}")]
        [SwaggerOperation("Hämtar låttext via slug")]
        public async Task<LyricsResponseDto> GetBySlug(string slug, CancellationToken ct)
            => await service.GetBySlugAsync(slug, ct);

        [HttpPost]
        [SwaggerOperation("Skapar en ny låttext")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<CreateLyricsResponseDto> Create(CreateLyricsRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [SwaggerOperation("Uppdaterar en befintlig låttext")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<UpdateLyricsResponseDto> Update(int id, UpdateLyricsRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Tar bort en befintlig låttext")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<DeleteLyricsResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}
