using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ISubscriberRepository : IRepository<Subscriber>
    {
        Task<bool> EmailExistsAsync(string email, CancellationToken ct);
        Task<Subscriber?> GetByEmailAsync(string email, CancellationToken ct);
        Task HardDeleteAsync(int id, CancellationToken ct);
    }
}
