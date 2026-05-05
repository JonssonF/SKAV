using SKAV.Domain.Consts;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.BookingRequest
{
    public class CreateBookingRequestDto
    {
        [Required(ErrorMessage = "Namn är obligatoriskt")]
        [MinLength(2, ErrorMessage = "Minst {1} tecken")]
        [MaxLength(100, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Anna Svensson")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "E-post är obligatorisk")]
        [RegularExpression(ValidationRegularExpression.Email, ErrorMessage = "Ogiltig e-postadress")]
        [DefaultValue("anna@example.com")]
        public required string Email { get; set; }

        [MaxLength(20, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("0701234567")]
        public string? Phone { get; set; }

        public DateTimeOffset? EventDate { get; set; }

        [MaxLength(100, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Fest")]
        public string? EventType { get; set; }

        [Required(ErrorMessage = "Meddelande är obligatoriskt")]
        [MinLength(10, ErrorMessage = "Minst {1} tecken")]
        [MaxLength(2000, ErrorMessage = "Max {1} tecken")]
        [DefaultValue("Hej, vi vill boka er till vår fest!")]
        public required string Message { get; set; }
    }
}