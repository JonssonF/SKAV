using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("ProductOrderNotificationRecipients")]
    public class ProductOrderNotificationRecipient : BaseEntity
    {
        public required string Email { get; set; }
        public int? MemberId { get; set; }
    }
}