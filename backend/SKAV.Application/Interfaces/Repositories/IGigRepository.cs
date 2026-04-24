using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IGigRepository : IRepository<Gig>
    {
        Task<bool> ExistsByTitleAndDateAsync(
            string title, DateTimeOffset date, int? excludeId, CancellationToken ct);
    }
}
