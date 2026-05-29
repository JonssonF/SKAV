using SKAV.Application.DTOs.SiteSetting;

namespace SKAV.Application.Services.Interface
{
    public interface ISiteSettingService
    {
        Task<IEnumerable<SiteSettingResponseDto>> GetAllAsync(CancellationToken ct);
        Task<UpdateSiteSettingResponseDto> UpdateAsync(UpdateSiteSettingDto request, CancellationToken ct);
    }
}