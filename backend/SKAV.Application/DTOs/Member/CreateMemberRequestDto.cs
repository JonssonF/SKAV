using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Member
{
    public class CreateMemberRequestDto
    {
        [Required(ErrorMessage = "Namn är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(@"^[\p{L}0-9\s\.\,\!\?\-:()']*$", ErrorMessage = "Ogiltiga tecken i Namn")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Roll är obligatorisk")]
        [MinLength(3, ErrorMessage = "Minst {1} tecken tillåtna")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken tillåtna")]
        [RegularExpression(@"^[\p{L}0-9\s\.\,\!\?\-:()']*$", ErrorMessage = "Ogiltiga tecken i Roll")]
        public string Role { get; set; } = null!;

        [RegularExpression(@"^[\p{L}0-9\s\.\,\!\?\-:()']*$", ErrorMessage = "Ogiltiga tecken i Quote")]
        public string? Quote { get; set; }
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; }
    }
}
