using SKAV.Domain.Enumeration;

namespace SKAV.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public Roles Role { get; set; }

    }
}
