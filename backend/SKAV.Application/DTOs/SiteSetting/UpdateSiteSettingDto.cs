using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.SiteSetting
{
    public class UpdateSiteSettingDto
    {
        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Value { get; set; } = string.Empty;
    }
}