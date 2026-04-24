using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Auth
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        [RegularExpression(ValidationRegularExpression.Email, ErrorMessage = "Ogiltig e-postadress")]
        [DefaultValue("admin@skav.se")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Lösenord är obligatoriskt")]
        [DefaultValue("1234")]
        public required string Password { get; set; }
    }
}
