using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Song;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/songs")]
    [ApiController]
    public class SongsController(ISongService service) : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation("Hämtar alla låtar")]
        public async Task<IEnumerable<SongResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [SwaggerOperation("Hämtar en låt baserat på ID")]
        public async Task<SongResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [SwaggerOperation("Skapar en ny låt")]
        public async Task<CreateSongResponseDto> Create(CreateSongRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [SwaggerOperation("Uppdaterar en befintlig låt")]
        public async Task<UpdateSongResponseDto> Update(int id, UpdateSongRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Tar bort en befintlig låt")]
        public async Task<DeleteSongResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}
