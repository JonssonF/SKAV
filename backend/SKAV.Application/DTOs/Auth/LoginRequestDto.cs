namespace SKAV.Application.DTOs.Auth
{
    public class LoginRequestDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string PasswordHash => BCrypt.Net.BCrypt.HashPassword(Password);
    }
}
