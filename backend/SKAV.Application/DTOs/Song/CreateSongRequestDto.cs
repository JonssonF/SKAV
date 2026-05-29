using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Song
{
    public class CreateSongRequestDto
    {
        public int? AlbumId { get; set; }

        [Required(ErrorMessage = "Titel är obligatorisk")]
        [MinLength(1, ErrorMessage = "Minst {1} tecken")]
        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        [RegularExpression(ValidationRegularExpression.GeneralText, ErrorMessage = "Ogiltiga tecken i titel")]
        [DefaultValue("Bohemian Rhapsody")]
        public required string Title { get; set; }

        [Range(1, 3600, ErrorMessage = "Längd måste vara mellan 1 och 3600 sekunder")]
        [DefaultValue(150)]
        public int? DurationSeconds { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "Ogiltig URL")]
        [DefaultValue("https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8?si=e11e473aa46349bd")]
        public string? SpotifyUrl { get; set; }

        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        [RegularExpression(ValidationRegularExpression.Name, ErrorMessage = "Ogiltiga tecken i låtskrivare")]
        [DefaultValue("Freddie")]
        public string? MusicWriter { get; set; }

        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        [RegularExpression(ValidationRegularExpression.Name, ErrorMessage = "Ogiltiga tecken i låtskrivare")]
        [DefaultValue("Mercury")]
        public string? LyricsWriter { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "Ogiltig URL")]
        [DefaultValue("https://youtube.com/watch?v=example")]
        public string? YoutubeUrl { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "Ogiltig URL")]
        public string? ImageUrl { get; set; }

        public DateTimeOffset? ReleaseDate { get; set; }

        [Range(1, 100, ErrorMessage = "Spårnummer måste vara mellan 1 och 100")]
        public int? TrackNumber { get; set; }
    }
}
