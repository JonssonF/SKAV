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
        public string? MusicWriter { get; set; }
        public string? LyricsWriter { get; set; }
        public int? TrackNumber { get; set; }
        public string? YoutubeUrl { get; set; }
        public DateTimeOffset? ReleaseDate{ get; set; }
    }
}
