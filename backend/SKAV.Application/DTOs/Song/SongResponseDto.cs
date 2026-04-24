namespace SKAV.Application.DTOs.Song
{
    public class SongResponseDto
    {
        public int Id { get; init; }
        public int? AlbumId { get; init; }
        public string Title { get; init; } = null!;
        public int? DurationSeconds { get; init; }
        public string? SpotifyUrl { get; init; }
        public string? Writer { get; init; }
        public int? TrackNumber { get; init; }
    }
}
