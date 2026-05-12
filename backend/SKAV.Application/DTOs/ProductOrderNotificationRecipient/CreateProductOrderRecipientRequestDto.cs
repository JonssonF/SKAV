using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.ProductOrderNotificationRecipient
{
    public class CreateProductOrderRecipientRequestDto
    {
        [Required(ErrorMessage = "E-post är obligatorisk")]
        public required string Email { get; set; }

        public int? MemberId { get; set; }
    }
}