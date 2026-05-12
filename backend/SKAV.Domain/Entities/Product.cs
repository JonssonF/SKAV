using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Products")]
    public class Product : BaseEntity
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? Category { get; set; }
        public int StockQuantity { get; set; }
        public int Version { get; set; }
    }
}