namespace SKAV.Application.DTOs.MemberInstrument
{
    public class MemberInstrumentResponseDto
    {
        public int Id { get; init; }
        public int MemberId { get; init; }
        public int InstrumentId { get; init; }
        public string? Details { get; init; }
    }
}
