using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.User
{
    public class UpdateUserRoleRequestDto
    {
        [Required(ErrorMessage = "Roll är obligatorisk")]
        [RegularExpression("^(Admin|Editor)$", ErrorMessage = "Roll måste vara Admin eller Editor")]
        [DefaultValue("Editor")]
        public required string Role { get; set; }
    }
}
