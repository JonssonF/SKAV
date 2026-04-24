using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Lyrics;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;
using System.Text.RegularExpressions;

namespace SKAV.Application.Services
{
    public class LyricsService(
        ILyricsRepository repo,
        ISongRepository songRepo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : ILyricsService
    {
        public async Task<LyricsResponseDto> GetBySlugAsync(string slug, CancellationToken ct)
        {
            var lyrics = await repo.GetBySlugAsync(slug, ct)
                ?? throw new NotFoundException(BusinessRules.LyricsNotFound);

            return MapToDto(lyrics);
        }

        public async Task<CreateLyricsResponseDto> CreateAsync(CreateLyricsRequestDto request, CancellationToken ct)
        {
            var song = await songRepo.GetByIdAsync(request.SongId, ct)
                ?? throw new NotFoundException(BusinessRules.SongNotFound);

            var existingLyrics = await repo.GetBySongIdAsync(request.SongId, ct);
            if (existingLyrics is not null)
                throw new BusinessRuleException(
                    "Låten har redan en låttext.",
                    BusinessRules.LyricsAlreadyExists);

            var slug = GenerateSlug(song.Title);

            var lyrics = new Lyrics
            {
                SongId = request.SongId,
                Slug = slug,
                Body = request.Body,
            };

            AuditHelper.SetCreated(lyrics, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(lyrics, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateLyricsResponseDto
            {
                Id = id,
                Slug = slug,
            };
        }

        public async Task<UpdateLyricsResponseDto> UpdateAsync(int id, UpdateLyricsRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.LyricsNotFound);

            var song = await songRepo.GetByIdAsync(request.SongId, ct)
                ?? throw new NotFoundException(BusinessRules.SongNotFound);

            // Om SongId ändras, kolla att den nya låten inte redan har lyrics
            if (request.SongId != existing.SongId)
            {
                var existingForSong = await repo.GetBySongIdAsync(request.SongId, ct);
                if (existingForSong is not null)
                    throw new BusinessRuleException(
                        "Låten har redan en låttext.",
                        BusinessRules.LyricsAlreadyExists);
            }

            existing.SongId = request.SongId;
            existing.Slug = GenerateSlug(song.Title);
            existing.Body = request.Body;

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateLyricsResponseDto();
        }

        public async Task<DeleteLyricsResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.LyricsNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteLyricsResponseDto();
        }

        private static string GenerateSlug(string title)
        {
            var slug = title.ToLowerInvariant();
            slug = Regex.Replace(slug, @"[åä]", "a");
            slug = Regex.Replace(slug, @"[ö]", "o");
            slug = Regex.Replace(slug, @"[é]", "e");
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = Regex.Replace(slug, @"-+", "-");
            slug = slug.Trim('-');
            return slug;
        }

        private static LyricsResponseDto MapToDto(Lyrics l) => new()
        {
            Id = l.Id,
            SongId = l.SongId,
            Slug = l.Slug,
            Body = l.Body,
        };
    }
}
