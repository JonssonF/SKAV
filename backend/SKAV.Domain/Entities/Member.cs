using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Members")]
    public class Member : BaseEntity
    {
        public required string Name { get; set; }
        public string? Role { get; set; }
        public string? Bio { get; set; }
        public string? Quote { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public int? UserId { get; set; }
    }
}