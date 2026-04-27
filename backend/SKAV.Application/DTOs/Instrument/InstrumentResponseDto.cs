namespace SKAV.Application.DTOs.Instrument
{
    public class InstrumentResponseDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = null!;
        public string? Description { get; init; }
    }
}
