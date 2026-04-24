using SKAV.Application.DTOs.Lyrics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Services.Interface
{
    public interface ILyricsService
    {
        Task<LyricsResponseDto> GetBySlugAsync(string slug, CancellationToken ct);
        Task<CreateLyricsResponseDto> CreateAsync(CreateLyricsRequestDto request, CancellationToken ct);
        Task<UpdateLyricsResponseDto> UpdateAsync(int id, UpdateLyricsRequestDto request, CancellationToken ct);
        Task<DeleteLyricsResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
