using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("ProductVariants")]
    public class ProductVariant : BaseEntity
    {
        public int ProductId { get; set; }
        public string Attributes { get; set; } = null!;
        public decimal? PriceOverride { get; set; }
        public int StockQuantity { get; set; }
        public int Version { get; set; }
    }
}