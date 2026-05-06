using SKAV.Domain.Enumeration;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.User
{
    public class UpdateUserRoleRequestDto
    {
        [Required(ErrorMessage = "Roll är obligatorisk")]
        [RegularExpression("^(Admin|Editor|Member)$", ErrorMessage = "Roll måste vara Admin, Editor eller Member")]
        [DefaultValue(Roles.Member)]
        public required Roles Roles { get; set; }
    }
}
