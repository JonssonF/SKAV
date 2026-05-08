namespace SKAV.Application.DTOs.BookingRequest
{
    public class BookingRequestResponseDto
    {
        public int Id { get; init; }
        public required string Name { get; init; }
        public required string Email { get; init; }
        public string? Phone { get; init; }
        public DateTimeOffset? EventDate { get; init; }
        public string? EventType { get; init; }
        public required string Message { get; init; }
        public bool IsRead { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTimeOffset? AnsweredAt { get; init; }
        public int? AnsweredBy { get; init; }
        public string? AnsweredByEmail { get; init; }
    }
}