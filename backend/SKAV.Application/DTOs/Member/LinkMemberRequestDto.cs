using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Member
{
    public class LinkMemberRequestDto
    {
        [Required(ErrorMessage = "MemberId är obligatoriskt.")]
        public required int MemberId { get; set; }
    }
}
