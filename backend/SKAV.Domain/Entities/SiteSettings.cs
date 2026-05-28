using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("SiteSettings")]
    public class SiteSetting
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public DateTimeOffset? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}