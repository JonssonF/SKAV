using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Gigs")]
    public class Gig : BaseEntity
    {
        public required string Title { get; set; }
        public required string Description { get; set; } = string.Empty;
        public required string Location { get; set; } = string.Empty;
        public required DateTimeOffset Date { get; set; }
        public string? Adress { get; set; }
        public decimal? Price { get; set; }
        public string? Notes { get; set; }
        public string? TicketUrl { get; set; }
    }
}