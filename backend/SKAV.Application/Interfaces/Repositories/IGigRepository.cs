using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IGigRepository
    {
            Task<IReadOnlyList<Gig>> GetAllGigsAsync(CancellationToken ct);
            Task<Gig?> GetGigByIdAsync(int id, CancellationToken ct);
            Task<int> CreateGigAsync(Gig gig, CancellationToken ct);
            Task UpdateGigAsync(Gig gig, CancellationToken ct);
            Task DeleteGigAsync(int id, CancellationToken ct);
            Task<int> GetGigCountAsync(CancellationToken ct);
            Task<bool> ExistsAsync(string title, DateTimeOffset date, int? excludeId, CancellationToken ct);
    }
}
