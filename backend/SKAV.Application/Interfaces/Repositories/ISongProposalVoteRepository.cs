using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ISongProposalVoteRepository
    {
        Task<bool> HasVotedOnActiveProposalAsync(string voterIp, IEnumerable<int> activeProposalIds, CancellationToken ct);
        Task CreateAsync(SongProposalVote vote, CancellationToken ct);
        Task<int> GetVoteCountAsync(int songProposalId, CancellationToken ct);
        Task<Dictionary<int, int>> GetVoteCountsAsync(IEnumerable<int> songProposalIds, CancellationToken ct);
        Task DeleteByProposalIdsAsync(IEnumerable<int> songProposalIds, CancellationToken ct);
    }
}