using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.ProductImage
{
    public class CreateProductImageRequestDto
    {
        [Required(ErrorMessage = "ProductId är obligatoriskt")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Bild-URL är obligatorisk")]
        [MaxLength(500, ErrorMessage = "Max {1} tecken")]
        public required string ImageUrl { get; set; }

        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }
}