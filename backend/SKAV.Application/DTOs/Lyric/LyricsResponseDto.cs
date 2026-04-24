namespace SKAV.Application.DTOs.Lyric
{
    public class LyricsResponseDto
    {
        public int Id { get; init; }
        public int SongId { get; init; }
        public string Slug { get; init; } = null!;
        public string Body { get; init; } = null!;
    }
}
