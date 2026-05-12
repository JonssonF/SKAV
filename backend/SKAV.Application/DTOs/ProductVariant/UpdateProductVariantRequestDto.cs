using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.ProductVariant
{
    public class UpdateProductVariantRequestDto
    {
        [Required(ErrorMessage = "Attribut är obligatoriska")]
        public required string Attributes { get; set; }

        public decimal? PriceOverride { get; set; }

        [Range(0, 99999, ErrorMessage = "Antal måste vara mellan {1} och {2}")]
        public int StockQuantity { get; set; }
    }
}