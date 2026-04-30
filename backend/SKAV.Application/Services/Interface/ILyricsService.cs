using SKAV.Application.DTOs.Lyrics;

namespace SKAV.Application.Services.Interface
{
    public interface ILyricsService
    {
        Task<IEnumerable<LyricsResponseDto>> GetAllAsync(CancellationToken ct);
        Task<LyricsResponseDto?> GetBySongIdAsync(int songId, CancellationToken ct);
        Task<LyricsResponseDto> GetBySlugAsync(string slug, CancellationToken ct);
        Task<CreateLyricsResponseDto> CreateAsync(CreateLyricsRequestDto request, CancellationToken ct);
        Task<UpdateLyricsResponseDto> UpdateAsync(int id, UpdateLyricsRequestDto request, CancellationToken ct);
        Task<DeleteLyricsResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
