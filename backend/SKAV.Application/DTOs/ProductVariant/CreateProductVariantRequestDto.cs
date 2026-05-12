using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.ProductVariant
{
    public class CreateProductVariantRequestDto
    {
        [Required(ErrorMessage = "ProduktId är obligatoriskt")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Attribut är obligatoriska")]
        [DefaultValue("{\"Storlek\":\"M\",\"Färg\":\"Röd\"}")]
        public required string Attributes { get; set; }

        public decimal? PriceOverride { get; set; }

        [Range(0, 99999, ErrorMessage = "Antal måste vara mellan {1} och {2}")]
        [DefaultValue(10)]
        public int StockQuantity { get; set; }
    }
}