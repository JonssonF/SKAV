using SKAV.Application.DTOs.Song;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Domain.Consts;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.Song
{
    public class SongValidator(ISongRepository repo) : ISongValidator
    {
        public async Task ValidateCreateAsync(CreateSongRequestDto request, CancellationToken ct)
        {
            await ValidateTitleExistsAsync(request.Title, request.AlbumId, null, ct);
            await ValidateTrackNumberAsync(request.TrackNumber, request.AlbumId, null, ct);
        }

        public async Task ValidateUpdateAsync(int id, UpdateSongRequestDto request, CancellationToken ct)
        {
            await ValidateTitleExistsAsync(request.Title, request.AlbumId, id, ct);
            await ValidateTrackNumberAsync(request.TrackNumber, request.AlbumId, id, ct);
        }

        private async Task ValidateTitleExistsAsync(string title, int? albumId, int? excludeId, CancellationToken ct)
        {
            var exists = await repo.ExistsByTitleAndAlbumAsync(title, albumId, excludeId, ct);
            if (exists)
                throw new BusinessRuleException(
                    "En låt med samma titel finns redan på detta album.",
                    BusinessRules.SongAlreadyExists);
        }

        private async Task ValidateTrackNumberAsync(int? trackNumber, int? albumId, int? excludeId, CancellationToken ct)
        {
            var exists = await repo.ExistsByTrackNumberAndAlbumAsync(trackNumber, albumId, excludeId, ct);
            if (exists)
                throw new BusinessRuleException(
                    "En låt med samma spårnummer finns redan på detta album.",
                    BusinessRules.SongAlreadyExists);
        }
    }
}
