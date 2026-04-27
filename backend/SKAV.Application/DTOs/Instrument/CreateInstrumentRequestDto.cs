namespace SKAV.Application.DTOs.Instrument
{
    public class CreateInstrumentRequestDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
    }
}
