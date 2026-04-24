using SKAV.Domain.Attributes;
using SKAV.Domain.Enumeration;

namespace SKAV.Domain.Entities
{
    [TableName("Users")]
    public class User : BaseEntity
    {
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public Roles Role { get; set; }

    }
}
