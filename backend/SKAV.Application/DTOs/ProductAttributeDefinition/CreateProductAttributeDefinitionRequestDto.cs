using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.ProductAttributeDefinition
{
    public class CreateProductAttributeDefinitionRequestDto
    {
        [Required(ErrorMessage = "ProduktId är obligatoriskt")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Namn är obligatoriskt")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Storlek")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Värden är obligatoriska")]
        [DefaultValue("[\"S\",\"M\",\"L\",\"XL\"]")]
        public required string Values { get; set; }

        [DefaultValue(0)]
        public int DisplayOrder { get; set; }
    }
}