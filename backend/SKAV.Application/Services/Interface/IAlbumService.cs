using SKAV.Application.DTOs.Album;

namespace SKAV.Application.Services.Interface
{
    public interface IAlbumService
    {
        Task<IEnumerable<AlbumResponseDto>> GetAllAsync(CancellationToken ct);
        Task<AlbumResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateAlbumResponseDto> CreateAsync(CreateAlbumRequestDto request, CancellationToken ct);
        Task<UpdateAlbumResponseDto> UpdateAsync(int id, UpdateAlbumRequestDto request, CancellationToken ct);
        Task<DeleteAlbumResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
