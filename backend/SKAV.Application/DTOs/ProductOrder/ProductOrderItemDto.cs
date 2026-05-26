namespace SKAV.Application.DTOs.ProductOrder
{
    public class ProductOrderItemDto
    {
        public int ProductId { get; init; }
        public required string ProductTitle { get; init; }
        public decimal ProductPrice { get; init; }
        public int ProductVariantId { get; init; }
        public string VariantAttributes { get; init; } = null!;
        public int Quantity { get; init; }
        public bool IsSigned { get; init; }
        public decimal? SigningPrice { get; init; }
    }
}