using SKAV.Application.DTOs.Song;

namespace SKAV.Application.Services.Interface
{
    public interface ISongService
    {
        Task<IEnumerable<SongResponseDto>> GetAllAsync(CancellationToken ct);
        Task<SongResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateSongResponseDto> CreateAsync(CreateSongRequestDto request, CancellationToken ct);
        Task<UpdateSongResponseDto> UpdateAsync(int id, UpdateSongRequestDto request, CancellationToken ct);
        Task<DeleteSongResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
