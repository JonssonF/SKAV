using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ISiteSettingRepository
    {
        Task CreateAsync(SiteSetting setting, CancellationToken ct);
        Task<IEnumerable<SiteSetting>> GetAllAsync(CancellationToken ct);
        Task<SiteSetting?> GetByKeyAsync(string key, CancellationToken ct);
        Task UpdateAsync(SiteSetting setting, CancellationToken ct);
    }
}