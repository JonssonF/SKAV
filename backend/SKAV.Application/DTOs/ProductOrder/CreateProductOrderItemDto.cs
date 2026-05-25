using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.ProductOrder
{
    public class CreateProductOrderItemDto
    {
        [Required]
        public int ProductVariantId { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "Antal måste vara mellan {1} och {2}")]
        public int Quantity { get; set; }

        public bool IsSigned { get; set; }
    }
}