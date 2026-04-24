using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Lyrics")]
    public class Lyrics : BaseEntity
    {
        public int SongId { get; set; }
        public required string Slug { get; set; }
        public required string Body { get; set; }
    }
}
