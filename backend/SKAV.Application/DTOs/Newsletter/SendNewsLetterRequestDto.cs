using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Newsletter
{
    public class SendNewsletterRequestDto
    {
        [Required(ErrorMessage = "Ämne är obligatoriskt")]
        [MinLength(1, ErrorMessage = "Minst {1} tecken")]
        [MaxLength(200, ErrorMessage = "Max {1} tecken")]
        public required string Subject { get; set; }

        [Required(ErrorMessage = "Innehåll är obligatoriskt")]
        [MinLength(1, ErrorMessage = "Minst {1} tecken")]
        [MaxLength(10000, ErrorMessage = "Max {1} tecken")]
        public required string Body { get; set; }
    }
}
