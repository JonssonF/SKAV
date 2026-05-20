using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("SongProposalVotes")]
    public class SongProposalVote
    {
        public int Id { get; set; }
        public int SongProposalId { get; set; }
        public required string VoterIp { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}