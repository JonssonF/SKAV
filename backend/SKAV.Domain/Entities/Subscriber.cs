using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Subscribers")]
    public class Subscriber : BaseEntity
    {
        public required string Email { get; set; }
    }
}
