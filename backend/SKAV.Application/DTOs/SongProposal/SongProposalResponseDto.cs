using SKAV.Application.DTOs.SongProposalVoteSnapshot;

namespace SKAV.Application.DTOs.SongProposal
{
    public class SongProposalResponseDto
    {
        public int Id { get; init; }
        public string Title { get; init; } = null!;
        public string? Description { get; init; }
        public string? LyricsBody { get; init; }
        public bool IsActive { get; init; }
        public bool IsWinner { get; init; }
        public int VoteCount { get; init; }
        public string? CreatedByEmail { get; init; }
        public List<SongProposalVoteSnapshotDto> VoteHistory { get; init; } = [];
    }
}