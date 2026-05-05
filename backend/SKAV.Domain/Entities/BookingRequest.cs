using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("BookingRequests")]
    public class BookingRequest : BaseEntity
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public DateTimeOffset? EventDate { get; set; }
        public string? EventType { get; set; }
        public required string Message { get; set; }
        public bool IsRead { get; set; }
    }
}