using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken ct);
        Task<bool> EmailExistsAsync(string email, CancellationToken ct);
        Task<User?> GetByResetTokenAsync(string token, CancellationToken ct);
    }
}
