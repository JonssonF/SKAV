using SKAV.Application.DTOs.Album;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Domain.Consts;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.Album
{
    public class AlbumValidator(IAlbumRepository repo) : IAlbumValidator
    {
        public async Task ValidateCreateAsync(CreateAlbumRequestDto request, CancellationToken ct)
        {
            await ValidateTitleExistsAsync(request.Title, null, ct);
        }

        public async Task ValidateUpdateAsync(int id, UpdateAlbumRequestDto request, CancellationToken ct)
        {
            await ValidateTitleExistsAsync(request.Title, id, ct);
        }

        private async Task ValidateTitleExistsAsync(string title, int? excludeId, CancellationToken ct)
        {
            var exists = await repo.ExistsByTitleAsync(title, excludeId, ct);
            if (exists)
                throw new BusinessRuleException(
                    "Ett album med samma titel finns redan.",
                    BusinessRules.AlbumAlreadyExists);
        }

        public async Task ValidateAlbumExistsAsync(int? albumId, CancellationToken ct)
        {
            if (albumId is null) return;

            var albumExists = await repo.ExistsAsync(albumId.Value, ct);
            if (!albumExists)
                throw new NotFoundException(BusinessRules.AlbumNotFound);
        }
    }
}
