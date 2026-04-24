using SKAV.Application.DTOs.Song;

namespace SKAV.Application.Validators.Song
{
    public interface ISongValidator
    {
        Task ValidateCreateAsync(CreateSongRequestDto request, CancellationToken ct);
        Task ValidateUpdateAsync(int id, UpdateSongRequestDto request, CancellationToken ct);
    }
}
