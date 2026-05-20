using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("SongProposalVoteSnapshots")]
    public class SongProposalVoteSnapshot
    {
        public int Id { get; set; }
        public int SongProposalId { get; set; }
        public int VoteCount { get; set; }
        public DateTimeOffset SnapshotDate { get; set; }
    }
}