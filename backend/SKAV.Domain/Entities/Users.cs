namespace SKAV.Domain.Entities
{
    public class Users
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public Roles roles { get; set; }

    }
}
