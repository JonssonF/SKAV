using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ISongProposalVoteSnapshotRepository
    {
        Task CreateAsync(SongProposalVoteSnapshot snapshot, CancellationToken ct);
        Task<IEnumerable<SongProposalVoteSnapshot>> GetByProposalIdAsync(int songProposalId, CancellationToken ct);
        Task<Dictionary<int, List<SongProposalVoteSnapshot>>> GetByProposalIdsAsync(IEnumerable<int> songProposalIds, CancellationToken ct);
        Task DeleteOldestAsync(int songProposalId, int keepCount, CancellationToken ct);
    }
}