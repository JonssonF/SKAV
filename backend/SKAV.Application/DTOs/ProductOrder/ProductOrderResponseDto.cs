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
        public DateTimeOffset? HandledAt { get; init; }
        public int? HandledBy { get; init; }
        public string? HandledByEmail { get; init; }
        public bool IsCancelled { get; init; }
        public DateTimeOffset? CancelledAt { get; init; }
        public int? CancelledBy { get; init; }
        public string? CancelledByEmail { get; init; }
        public DateTimeOffset? CreatedAt { get; init; }
        public List<ProductOrderItemDto> Items { get; init; } = [];
    }
}