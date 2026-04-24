namespace SKAV.Application.DTOs.Gigs
{
    public class GigResponseDto
    {
        public int Id { get; init; }
        public string Title { get; init; } = null!;
        public string Description { get; init; } = null!;
        public string Location { get; init; } = null!;
        public string? Adress { get; init; }
        public DateTimeOffset Date { get; init; }
        public decimal? Price { get; init; }
        public string? Notes { get; init; }
        public string? TicketUrl { get; init; }
    }
}