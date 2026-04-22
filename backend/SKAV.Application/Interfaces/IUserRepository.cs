using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken ct);
        Task<bool> EmailExistsAsync(string email, CancellationToken ct);
        Task CreateAsync(User user, CancellationToken ct);
    }
}
