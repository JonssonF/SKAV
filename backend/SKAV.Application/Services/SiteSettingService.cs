using SKAV.Application.DTOs.SiteSetting;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class SiteSettingService(
        ISiteSettingRepository repo,
        IUserRepository userRepo,
        ICurrentUserService currentUser,
        IUnitOfWork uow) : ISiteSettingService
    {
        public async Task<IEnumerable<SiteSettingResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var settings = await repo.GetAllAsync(ct);
            var users = await userRepo.GetAllAsync(ct);
            var userLookup = users.ToDictionary(u => u.Id, u => u.Email);

            return settings.Select(s => MapToDto(s, userLookup));
        }

        public async Task<UpdateSiteSettingResponseDto> UpdateAsync(UpdateSiteSettingDto request, CancellationToken ct)
        {
            var setting = await repo.GetByKeyAsync(request.Key, ct)
                ?? throw new NotFoundException($"Setting '{request.Key}' not found.");

            setting.Value = request.Value;
            setting.UpdatedAt = DateTimeOffset.UtcNow;
            setting.UpdatedBy = currentUser.UserId;

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(setting, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateSiteSettingResponseDto();
        }

        private static SiteSettingResponseDto MapToDto(SiteSetting s, Dictionary<int, string> userLookup) => new()
        {
            Key = s.Key,
            Value = s.Value,
            UpdatedAt = s.UpdatedAt,
            UpdatedByEmail = s.UpdatedBy.HasValue && userLookup.ContainsKey(s.UpdatedBy.Value)
                ? userLookup[s.UpdatedBy.Value]
                : null,
        };
    }
}