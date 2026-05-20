namespace SKAV.Application.DTOs.SongProposalVoteSnapshot
{
    public class SongProposalVoteSnapshotDto
    {
        public int VoteCount { get; init; }
        public DateTimeOffset SnapshotDate { get; init; }
    }
}