using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Auth
{
    public class ForgotPasswordRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        [EmailAddress(ErrorMessage = "Ogiltig e-postadress")]
        public required string Email { get; set; }
    }
}