using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("SongProposals")]
    public class SongProposal : BaseEntity
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? LyricsBody { get; set; }
        public bool IsActive { get; set; }
        public bool IsWinner { get; set; }
    }
}