using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.SongProposal
{
    public class CreateSongProposalRequestDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = null!;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [MaxLength(10000)]
        public string? LyricsBody { get; set; }

        public bool IsActive { get; set; }
    }
}