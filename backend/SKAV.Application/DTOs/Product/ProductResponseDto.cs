namespace SKAV.Application.DTOs.Product
{
    public class ProductResponseDto
    {
        public int Id { get; init; }
        public required string Title { get; init; }
        public required string Description { get; init; }
        public decimal Price { get; init; }
        public string? ImageUrl { get; init; }
        public string? Category { get; init; }
        public int StockQuantity { get; init; }
    }
}