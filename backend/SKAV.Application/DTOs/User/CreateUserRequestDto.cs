using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.User
{
    public class CreateUserRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        [RegularExpression(ValidationRegularExpression.Email, ErrorMessage = "Ogiltig e-postadress")]
        [DefaultValue("example@mail.com")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Lösenord är obligatoriskt")]
        [MinLength(8, ErrorMessage = "Lösenord måste vara minst {1} tecken")]
        [RegularExpression(ValidationRegularExpression.Password, ErrorMessage = "Lösenord måste innehålla minst en stor bokstav, en liten bokstav, en siffra och ett specialtecken")]
        [DefaultValue("P@ssw0rd")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Roll är obligatorisk")]
        [RegularExpression("^(Admin|Editor)$", ErrorMessage = "Roll måste vara Admin eller Editor")]
        [DefaultValue("Editor")]
        public required string Role { get; set; } = "Editor";
    }
}
