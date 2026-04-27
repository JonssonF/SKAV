using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Album;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validators.Album;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class AlbumService(
        IAlbumRepository repo,
        IAlbumValidator validator,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IAlbumService
    {
        public async Task<IEnumerable<AlbumResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var albums = await repo.GetAllAsync(ct);

            return albums
                .OrderByDescending(a => a.ReleaseDate)
                .Select(MapToDto);
        }

        public async Task<AlbumResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var album = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.AlbumNotFound);

            return MapToDto(album);
        }

        public async Task<CreateAlbumResponseDto> CreateAsync(CreateAlbumRequestDto request, CancellationToken ct)
        {
            

            await validator.ValidateCreateAsync(request, ct);

            var album = new Album
            {
                Title = request.Title,
                CoverImageUrl = request.CoverImageUrl,
                ReleaseDate = request.ReleaseDate,
                SpotifyUrl = request.SpotifyUrl,
                Description = request.Description,
            };

            AuditHelper.SetCreated(album, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(album, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateAlbumResponseDto { Id = id };
        }

        public async Task<UpdateAlbumResponseDto> UpdateAsync(int id, UpdateAlbumRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.AlbumNotFound);

            await validator.ValidateUpdateAsync(id, request, ct);

            existing.Title = request.Title;
            existing.CoverImageUrl = request.CoverImageUrl;
            existing.ReleaseDate = request.ReleaseDate;
            existing.SpotifyUrl = request.SpotifyUrl;
            existing.Description = request.Description;

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateAlbumResponseDto();
        }

        public async Task<DeleteAlbumResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.AlbumNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteAlbumResponseDto();
        }

        private static AlbumResponseDto MapToDto(Album a) => new()
        {
            Id = a.Id,
            Title = a.Title,
            CoverImageUrl = a.CoverImageUrl,
            ReleaseDate = a.ReleaseDate,
            SpotifyUrl = a.SpotifyUrl,
            Description = a.Description,
        };
    }
}
