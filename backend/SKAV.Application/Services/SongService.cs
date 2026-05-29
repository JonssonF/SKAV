using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Song;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validators.Album;
using SKAV.Application.Validators.Song;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class SongService(
        ISongRepository repo,
        IAlbumValidator albumValidator,
        ISongValidator songValidator,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : ISongService
    {
        public async Task<IEnumerable<SongResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var songs = await repo.GetAllAsync(ct);

            return songs
                .OrderBy(s => s.AlbumId)
                .ThenBy(s => s.TrackNumber)
                .Select(MapToDto);
        }

        public async Task<SongResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var song = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongNotFound);

            return MapToDto(song);
        }

        public async Task<CreateSongResponseDto> CreateAsync(CreateSongRequestDto request, CancellationToken ct)
        {
            await albumValidator.ValidateAlbumExistsAsync(request.AlbumId, ct);
            await songValidator.ValidateCreateAsync(request, ct);


            var song = new Song
            {
                AlbumId = request.AlbumId,
                Title = request.Title,
                DurationSeconds = request.DurationSeconds,
                SpotifyUrl = request.SpotifyUrl,
                MusicWriter = request.MusicWriter,
                LyricsWriter = request.LyricsWriter,
                TrackNumber = request.TrackNumber,
                YoutubeUrl = request.YoutubeUrl,
                ImageUrl = request.ImageUrl,
                ReleaseDate = request.ReleaseDate,
            };
            

            AuditHelper.SetCreated(song, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(song, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateSongResponseDto { Id = id };
        }

        public async Task<UpdateSongResponseDto> UpdateAsync(int id, UpdateSongRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongNotFound);

            await albumValidator.ValidateAlbumExistsAsync(request.AlbumId, ct);
            await songValidator.ValidateUpdateAsync(id, request, ct);

            existing.AlbumId = request.AlbumId;
            existing.Title = request.Title;
            existing.DurationSeconds = request.DurationSeconds;
            existing.SpotifyUrl = request.SpotifyUrl;
            existing.MusicWriter = request.MusicWriter;
            existing.LyricsWriter = request.LyricsWriter;
            existing.TrackNumber = request.TrackNumber;
            existing.YoutubeUrl = request.YoutubeUrl;
            existing.ImageUrl = request.ImageUrl;
            existing.ReleaseDate = request.ReleaseDate;

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateSongResponseDto();
        }

        public async Task<DeleteSongResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteSongResponseDto();
        }

        private static SongResponseDto MapToDto(Song s) => new()
        {
            Id = s.Id,
            AlbumId = s.AlbumId,
            Title = s.Title,
            DurationSeconds = s.DurationSeconds,
            SpotifyUrl = s.SpotifyUrl,
            MusicWriter = s.MusicWriter,
            LyricsWriter = s.LyricsWriter,
            TrackNumber = s.TrackNumber,
            YoutubeUrl = s.YoutubeUrl,
            ImageUrl = s.ImageUrl,
            ReleaseDate = s.ReleaseDate,
        };
    }
}
