using SKAV.Domain.Consts;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Member
{
    public class UpdateMemberRequestDto
    {
        [Required(ErrorMessage = "Namn är obligatoriskt")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.Name, ErrorMessage = "Ogiltiga tecken i namn")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Roll är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.Role, ErrorMessage = "Ogiltiga tecken i roll")]
        public required string Role { get; set; }

        [MaxLength(300, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(ValidationRegularExpression.FreeText, ErrorMessage = "Ogiltiga tecken i citat")]
        public string? Quote { get; set; }

        [RegularExpression(ValidationRegularExpression.Url, ErrorMessage = "ImageUrl måste vara en giltig URL")]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; }
    }
}
