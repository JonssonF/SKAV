namespace SKAV.Application.DTOs.ProductOrderNotificationRecipient
{
    public class ProductOrderRecipientResponseDto
    {
        public int Id { get; init; }
        public required string Email { get; init; }
        public int? MemberId { get; init; }
    }
}