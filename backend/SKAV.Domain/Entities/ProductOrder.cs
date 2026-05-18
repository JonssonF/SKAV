using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("ProductOrders")]
    public class ProductOrder : BaseEntity
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public string? Message { get; set; }
        public bool IsHandled { get; set; }
        public DateTime? HandledAt { get; set; }
        public int? HandledBy { get; set; }
        public bool IsCancelled { get; set; }
        public DateTimeOffset? CancelledAt { get; set; }
        public int? CancelledBy { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
    }
}