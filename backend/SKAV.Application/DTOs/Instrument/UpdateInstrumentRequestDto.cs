namespace SKAV.Application.DTOs.Instrument
{
    public class UpdateInstrumentRequestDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
    }
}
