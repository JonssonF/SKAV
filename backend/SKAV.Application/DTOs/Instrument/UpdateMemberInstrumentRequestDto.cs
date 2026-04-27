namespace SKAV.Application.DTOs.Instrument
{
    public class UpdateMemberInstrumentRequestDto
    {
        public required int MemberId { get; set; }
        public required int InstrumentId { get; set; }
        public string? Details { get; set; }
    }
}
