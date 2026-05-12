namespace SKAV.Application.DTOs.ProductOrder
{
    public class ProductOrderResponseDto
    {
        public int Id { get; init; }
        public required string Name { get; init; }
        public required string Email { get; init; }
        public string? Phone { get; init; }
        public string? Message { get; init; }
        public bool IsHandled { get; init; }
        public DateTime? HandledAt { get; init; }
        public int? HandledBy { get; init; }
        public string? HandledByEmail { get; init; }
        public DateTime CreatedAt { get; init; }
        public List<ProductOrderItemDto> Items { get; init; } = [];
    }
}