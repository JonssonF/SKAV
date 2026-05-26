using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Product
{
    public class CreateProductRequestDto
    {
        [Required(ErrorMessage = "Titel är obligatorisk")]
        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("SKAV T-shirt")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Beskrivning är obligatorisk")]
        [MaxLength(2000, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Svart t-shirt med SKAV-logga")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Pris är obligatoriskt")]
        [Range(0, 99999, ErrorMessage = "Pris måste vara mellan {1} och {2}")]
        [DefaultValue(249)]
        public decimal Price { get; set; }

        [MaxLength(100, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Kläder")]
        public string? Category { get; set; }

        [DefaultValue(false)]
        public bool IsSignable { get; set; }

        [Range(0, 99999, ErrorMessage = "Signeringspris måste vara mellan {1} och {2}")]
        public decimal? SigningPrice { get; set; }
    }
}