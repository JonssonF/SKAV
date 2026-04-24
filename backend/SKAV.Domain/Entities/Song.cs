using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Songs")]
    public class Song : BaseEntity
    {
        public int? AlbumId { get; set; }
        public required string Title { get; set; }
        public int? DurationSeconds { get; set; }
        public string? SpotifyUrl { get; set; }
        public string? Writer { get; set; }
        public int? TrackNumber { get; set; }
    }
}
