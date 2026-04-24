using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.DTOs.Lyric
{
    public class CreateLyricsResponseDto
    {
        public int Id { get; init; }
        public string Slug { get; init; } = null!;
    }
}
