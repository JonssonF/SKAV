namespace SKAV.Application.DTOs.ProductOrder
{
    public class ProductOrderItemDto
    {
        public int ProductId { get; init; }
        public required string ProductTitle { get; init; }
        public decimal ProductPrice { get; init; }
        public int Quantity { get; init; }
    }
}