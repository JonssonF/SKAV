using SKAV.Domain.Consts;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Album
{
    public class UpdateAlbumRequestDto
    {
        [Required(ErrorMessage = "Titel är obligatorisk")]
        [MinLength(1, ErrorMessage = "Minst {1} tecken")]
        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        [RegularExpression(ValidationRegularExpression.GeneralText, ErrorMessage = "Ogiltiga tecken i titel")]
        public required string Title { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "Ogiltig URL")]
        public string? CoverImageUrl { get; set; }

        public DateTime? ReleaseDate { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "Ogiltig URL")]
        public string? SpotifyUrl { get; set; }

        [MaxLength(1000, ErrorMessage = "Max {1} tecken")]
        [RegularExpression(ValidationRegularExpression.FreeText, ErrorMessage = "Ogiltiga tecken i beskrivning")]
        public string? Description { get; set; }
    }
}
