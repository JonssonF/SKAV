namespace SKAV.Application.DTOs.SiteSetting
{
    public class SiteSettingResponseDto
    {
        public string Key { get; init; } = string.Empty;
        public string Value { get; init; } = string.Empty;
        public DateTimeOffset? UpdatedAt { get; init; }
        public string? UpdatedByEmail { get; init; }
    }
}