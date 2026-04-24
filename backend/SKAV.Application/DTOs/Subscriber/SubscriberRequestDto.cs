using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Subscriber
{
    public class SubscriberRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        [RegularExpression(ValidationRegularExpression.Email, ErrorMessage = "Ogiltig e-postadress")]
        [DefaultValue("example@mail.com")]
        public required string Email { get; set; }
    }
}
