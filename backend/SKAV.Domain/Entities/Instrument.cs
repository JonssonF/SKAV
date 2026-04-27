using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Instruments")]
    public class Instrument : BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public ICollection<MemberInstrument> MemberInstruments { get; set; } = null!;
    }
}
