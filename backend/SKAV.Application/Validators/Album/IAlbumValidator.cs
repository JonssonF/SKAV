using SKAV.Application.DTOs.Album;

namespace SKAV.Application.Validators.Album
{
    public interface IAlbumValidator
    {
        Task ValidateCreateAsync(CreateAlbumRequestDto request, CancellationToken ct);
        Task ValidateUpdateAsync(int id, UpdateAlbumRequestDto request, CancellationToken ct);
    }
}
