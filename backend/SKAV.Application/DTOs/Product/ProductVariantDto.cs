namespace SKAV.Application.DTOs.Product
{
    public class ProductVariantDto
    {
        public int Id { get; init; }
        public string Attributes { get; init; } = null!;
        public decimal? PriceOverride { get; init; }
        public int StockQuantity { get; init; }
    }
}