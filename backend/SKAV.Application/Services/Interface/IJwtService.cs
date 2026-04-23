using SKAV.Domain.Entities;

namespace SKAV.Application.Services.Interface
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
