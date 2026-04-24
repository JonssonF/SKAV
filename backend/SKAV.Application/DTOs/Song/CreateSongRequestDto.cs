using SKAV.Domain.Consts;
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
        public required string Title { get; set; }

        [Range(1, 3600, ErrorMessage = "Längd måste vara mellan 1 och 3600 sekunder")]
        public int? DurationSeconds { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "Ogiltig URL")]
        public string? SpotifyUrl { get; set; }

        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        [RegularExpression(ValidationRegularExpression.Name, ErrorMessage = "Ogiltiga tecken i låtskrivare")]
        public string? Writer { get; set; }

        [Range(1, 100, ErrorMessage = "Spårnummer måste vara mellan 1 och 100")]
        public int? TrackNumber { get; set; }
    }
}
