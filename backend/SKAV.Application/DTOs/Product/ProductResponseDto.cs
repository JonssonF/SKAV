using SKAV.Application.DTOs.ProductImage;

namespace SKAV.Application.DTOs.Product
{
    public class ProductResponseDto
    {
        public int Id { get; init; }
        public required string Title { get; init; }
        public required string Description { get; init; }
        public decimal Price { get; init; }
        public string? Category { get; init; }
        public bool IsSignable { get; init; }
        public decimal? SigningPrice { get; init; }
        public List<ProductImageDto> Images { get; init; } = [];
        public List<ProductAttributeDefinitionDto> AttributeDefinitions { get; init; } = [];
        public List<ProductVariantDto> Variants { get; init; } = [];
    }
}