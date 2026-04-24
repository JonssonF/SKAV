using SKAV.Domain.Consts;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Subscriber
{
    public class SubscriberRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        [RegularExpression(ValidationRegularExpression.Email, ErrorMessage = "Ogiltig e-postadress")]
        public required string Email { get; set; }
    }
}
