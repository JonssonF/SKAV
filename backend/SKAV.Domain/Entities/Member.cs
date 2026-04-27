using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Members")]
    public class Member : BaseEntity
    {
        public required string Name { get; set; }
        public string? Quote { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public ICollection<MemberInstrument> MemberInstruments { get; set; } = null!;
    }
}