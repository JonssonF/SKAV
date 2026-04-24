using SKAV.Application.Common;
using SKAV.Application.DTOs.Gigs;

namespace SKAV.Application.Services.Interface
{
    public interface IGigService
    {
        Task<IEnumerable<GigResponseDto>> GetAllAsync(CancellationToken ct);
        Task<GigResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<int> CreateAsync(CreateGigRequestDto request, CancellationToken ct);
        Task UpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct);
        Task DeleteAsync(int id, CancellationToken ct);
    }
}
