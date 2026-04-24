using SKAV.Domain.Consts;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.User
{
    public class CreateUserRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        [RegularExpression(ValidationRegularExpression.Email, ErrorMessage = "Ogiltig e-postadress")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Lösenord är obligatoriskt")]
        [MinLength(8, ErrorMessage = "Lösenord måste vara minst {1} tecken")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Roll är obligatorisk")]
        [RegularExpression("^(Admin|Editor)$", ErrorMessage = "Roll måste vara Admin eller Editor")]
        public required string Role { get; set; } = "Editor";
    }
}
