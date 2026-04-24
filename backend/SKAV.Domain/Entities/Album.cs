using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("Albums")]
    public class Album : BaseEntity
    {
        public required string Title { get; set; }
        public string? CoverImageUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? SpotifyUrl { get; set; }
        public string? Description { get; set; }
    }
}
