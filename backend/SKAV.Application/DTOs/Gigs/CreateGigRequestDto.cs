using SKAV.Domain.Consts;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Gigs
{
    public class CreateGigRequestDto
    {
        [Required(ErrorMessage = "Titel är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.GeneralText, ErrorMessage = "Ogiltiga tecken i titel")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Beskrivning är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(500, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.FreeText, ErrorMessage = "Ogiltiga tecken i beskrivning")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Plats är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(200, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.City, ErrorMessage = "Ogiltiga tecken i platsen")]
        public required string Location { get; set; }

        [MaxLength(200, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.Address, ErrorMessage = "Ogiltiga tecken i adressen")]
        public string? Adress { get; set; }

        [Required(ErrorMessage = "Datum är obligatoriskt")]
        public required DateTimeOffset Date { get; set; }

        [Required(ErrorMessage = "Pris är obligatoriskt")]
        [Range(0, 10000, ErrorMessage = "Pris måste vara mellan 0 och 10.000kr")]
        public required decimal Price { get; set; }

        [MaxLength(500, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.FreeText, ErrorMessage = "Ogiltiga tecken i noteringar")]
        public string? Notes { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "TicketUrl måste vara en giltig URL")]
        public string? TicketUrl { get; set; }
    }
}
