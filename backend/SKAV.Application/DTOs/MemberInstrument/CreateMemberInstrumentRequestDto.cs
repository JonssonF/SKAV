namespace SKAV.Application.DTOs.MemberInstrument
{
    public class CreateMemberInstrumentRequestDto
    {
        public required int MemberId { get; set; }
        public required int InstrumentId { get; set; }
        public string? Details { get; set; }
    }
}
