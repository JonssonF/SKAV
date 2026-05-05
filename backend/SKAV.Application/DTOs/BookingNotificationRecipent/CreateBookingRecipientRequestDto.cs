using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.BookingNotificationRecipient
{
    public class CreateBookingRecipientRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        [RegularExpression(ValidationRegularExpression.Email, ErrorMessage = "Ogiltig e-postadress")]
        [DefaultValue("klas@skav.se")]
        public required string Email { get; set; }

        public int? MemberId { get; set; }
    }
}