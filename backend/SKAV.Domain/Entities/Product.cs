using SKAV.Domain.Attributes;
namespace SKAV.Domain.Entities
{
    [TableName("Products")]
    public class Product : BaseEntity
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public bool IsSignable { get; set; }
        public decimal? SigningPrice { get; set; }
    }
}