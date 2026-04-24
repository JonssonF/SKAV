namespace SKAV.Application.DTOs.Album
{
    public class AlbumResponseDto
    {
        public int Id { get; init; }
        public string Title { get; init; } = null!;
        public string? CoverImageUrl { get; init; }
        public DateTime? ReleaseDate { get; init; }
        public string? SpotifyUrl { get; init; }
        public string? Description { get; init; }
    }
}
