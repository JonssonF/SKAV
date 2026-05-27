using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Auth
{
    public class ResetPasswordRequestDto
    {
        [Required(ErrorMessage = "Token är obligatorisk")]
        public required string Token { get; set; }

        [Required(ErrorMessage = "Nytt lösenord är obligatoriskt")]
        [MinLength(6, ErrorMessage = "Lösenordet måste vara minst 6 tecken")]
        public required string NewPassword { get; set; }
    }
}