using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Product
{
    public class UpdateProductRequestDto
    {
        [Required(ErrorMessage = "Titel är obligatorisk")]
        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Beskrivning är obligatorisk")]
        [MaxLength(2000, ErrorMessage = "Max {1} tecken")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Pris är obligatoriskt")]
        [Range(0, 99999, ErrorMessage = "Pris måste vara mellan {1} och {2}")]
        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }

        [MaxLength(100, ErrorMessage = "Max {1} tecken")]
        public string? Category { get; set; }
    }
}