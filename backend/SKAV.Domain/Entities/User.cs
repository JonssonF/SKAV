using SKAV.Domain.Enumeration;

namespace SKAV.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public Roles Role { get; set; }

    }
}
