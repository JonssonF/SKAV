using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Member
{
    public class CreateMemberRequestDto
    {
        [Required(ErrorMessage = "Namn är obligatoriskt")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.Name, ErrorMessage = "Ogiltiga tecken i namn")]
        [DefaultValue("Klas")]
        public required string Name { get; set; }

        [MaxLength(300, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.FreeText, ErrorMessage = "Ogiltiga tecken i citat")]
        [DefaultValue("Inget citat")]
        public string? Quote { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "ImageUrl måste vara en giltig URL")]
        [DefaultValue("https://example.com/image.jpg")]
        public string? ImageUrl { get; set; }
        
        [DefaultValue(0)]
        public int DisplayOrder { get; set; }
    }
}
