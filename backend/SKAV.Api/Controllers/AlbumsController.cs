using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Album;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/albums")]
    [ApiController]
    public class AlbumsController(IAlbumService service) : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation("Hämtar alla album")]
        public async Task<IEnumerable<AlbumResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [SwaggerOperation("Hämtar ett album baserat på ID")]
        public async Task<AlbumResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [SwaggerOperation("Skapar ett nytt album")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<CreateAlbumResponseDto> Create(CreateAlbumRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [SwaggerOperation("Uppdaterar ett befintligt album")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<UpdateAlbumResponseDto> Update(int id, UpdateAlbumRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Tar bort ett befintligt album")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<DeleteAlbumResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}
