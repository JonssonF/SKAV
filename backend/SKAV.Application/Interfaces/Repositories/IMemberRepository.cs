using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IMemberRepository : IRepository<Member>
    {
        Task<bool> ExistsByDisplayOrderAsync(int displayOrder, int? excludeId, CancellationToken ct);
    }
}
