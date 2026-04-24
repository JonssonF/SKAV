using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.User
{
    public class ChangePasswordRequestDto
    {
        [Required(ErrorMessage = "Nuvarande lösenord är obligatoriskt")]
        [DefaultValue("CurrentPassword")]
        public required string CurrentPassword { get; set; }

        [Required(ErrorMessage = "Nytt lösenord är obligatoriskt")]
        [MinLength(8, ErrorMessage = "Lösenord måste vara minst {1} tecken")]
        [DefaultValue("NewPassword")]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "Bekräfta lösenord är obligatoriskt")]
        [Compare(nameof(NewPassword), ErrorMessage = "Lösenorden matchar inte")]
        [DefaultValue("NewPassword")]
        public required string ConfirmNewPassword { get; set; }
    }
}
