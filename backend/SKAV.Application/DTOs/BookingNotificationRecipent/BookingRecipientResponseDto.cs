namespace SKAV.Application.DTOs.BookingNotificationRecipient
{
    public class BookingRecipientResponseDto
    {
        public int Id { get; init; }
        public required string Email { get; init; }
        public int? MemberId { get; init; }
    }
}