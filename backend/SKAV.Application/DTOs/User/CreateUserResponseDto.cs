namespace SKAV.Application.DTOs.User
{
    public class CreateUserResponseDto
    {
        public string Email { get; init; } = null!;
        public string Role { get; init; } = null!;
    }
}
