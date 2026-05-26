namespace SKAV.Application.DTOs.ProductImage
{
    public class ProductImageDto
    {
        public int Id { get; init; }
        public int ProductId { get; init; }
        public required string ImageUrl { get; init; }
        public bool IsPrimary { get; init; }
        public int DisplayOrder { get; init; }
    }
}