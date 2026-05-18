using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.ProductOrder
{
    public class CreateProductOrderRequestDto
    {
        [Required(ErrorMessage = "Namn är obligatoriskt")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Anna Svensson")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "E-post är obligatorisk")]
        [DefaultValue("anna@example.com")]
        public required string Email { get; set; }

        [MaxLength(20, ErrorMessage = "Max {1} tecken")]
        public string? Phone { get; set; }

        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        public string? Address { get; set; }

        [MaxLength(100, ErrorMessage = "Max {1} tecken")]
        public string? City { get; set; }

        [MaxLength(10, ErrorMessage = "Max {1} tecken")]
        public string? PostalCode { get; set; }

        [MaxLength(1000, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Storlek M tack!")]
        public string? Message { get; set; }

        [Required(ErrorMessage = "Minst en produkt krävs")]
        [MinLength(1, ErrorMessage = "Minst en produkt krävs")]
        public required List<CreateProductOrderItemDto> Items { get; set; }
    }
}