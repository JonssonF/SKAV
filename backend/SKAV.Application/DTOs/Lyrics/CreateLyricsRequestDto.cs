using System.ComponentModel.DataAnnotations;

namespace SKAV.Application.DTOs.Lyrics
{
    public class CreateLyricsRequestDto
    {
        [Required(ErrorMessage = "SongId är obligatoriskt")]
        public required int SongId { get; set; }

        [Required(ErrorMessage = "Låttext är obligatorisk")]
        [MaxLength(5000, ErrorMessage = "Max {1} tecken")]
        public required string Body { get; set; }
    }
}
