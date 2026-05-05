using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("BookingNotificationRecipients")]
    public class BookingNotificationRecipient : BaseEntity
    {
        public required string Email { get; set; }
        public int? MemberId { get; set; }
        public Member? Member { get; set; }
    }
}