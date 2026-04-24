using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken ct);
        Task<User?> GetByIdAsync(int? id, CancellationToken ct);
        Task<bool> EmailExistsAsync(string email, CancellationToken ct);
        Task CreateAsync(User user, CancellationToken ct);
        Task UpdateAsync(User user, CancellationToken ct);
        Task DeleteAsync(int id, CancellationToken ct);
    }
}
