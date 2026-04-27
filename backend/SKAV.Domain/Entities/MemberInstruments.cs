using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("MemberInstruments")]
    public class MemberInstrument : BaseEntity
    {
        public required int MemberId { get; set; }
        public Member Member { get; set; } = null!;
        public required int InstrumentId { get; set; }
        public Instrument Instrument { get; set; } = null!;
        public string? Details { get; set; }
    }
}
