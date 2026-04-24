using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Gigs
{
    public class CreateGigRequestDto
    {
        [Required(ErrorMessage = "Titel är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.GeneralText, ErrorMessage = "Ogiltiga tecken i titel")]
        [DefaultValue("SKAV-FEST")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Beskrivning är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(500, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.FreeText, ErrorMessage = "Ogiltiga tecken i beskrivning")]
        [DefaultValue("Beskrivning av giget")]

        public required string Description { get; set; }

        [Required(ErrorMessage = "Plats är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(200, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.City, ErrorMessage = "Ogiltiga tecken i platsen")]
        [DefaultValue("Stockholm")]
        public required string Location { get; set; }

        [MaxLength(200, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.Address, ErrorMessage = "Ogiltiga tecken i adressen")]
        [DefaultValue("Gatuadress 1")]
        public string? Adress { get; set; }

        [Required(ErrorMessage = "Datum är obligatoriskt")]
        [DefaultValue("2024-01-01T00:00:00Z")]
        public required DateTimeOffset Date { get; set; }

        [Required(ErrorMessage = "Pris är obligatoriskt")]
        [Range(0, 10000, ErrorMessage = "Pris måste vara mellan 0 och 10.000kr")]
        [DefaultValue(0)]
        public required decimal Price { get; set; }

        [MaxLength(500, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.FreeText, ErrorMessage = "Ogiltiga tecken i noteringar")]
        [DefaultValue("Inga noteringar")]
        public string? Notes { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "TicketUrl måste vara en giltig URL")]
        [DefaultValue("https://example.com/ticket")]
        public string? TicketUrl { get; set; }
    }
}
