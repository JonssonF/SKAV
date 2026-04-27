using SKAV.Domain.Enumeration;

namespace SKAV.Application.DTOs.User
{
    public class CreateUserResponseDto
    {
        public string Email { get; init; } = null!;
        public Roles Roles { get; init; }
    }
}
