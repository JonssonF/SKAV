namespace SKAV.Domain.Entities
{
    public class Gig : BaseEntity
    {
        public int Id { get; set; }

        //Mandatory fields

        public required string Title { get; set; }
        
        public required string Description { get; set; } = string.Empty;
        
        public required string Location { get; set; } = string.Empty;

        public required DateTimeOffset Date { get; set; }

        //Optional fields
        public string? Adress { get; set; }

        public decimal? Price { get; set; }
        
        public string? Notes { get; set; }

        public bool IsPrivate { get; set; } = false;
        
        public string? TicketUrl { get; set; }
    }
}
