using SKAV.Application.Common;
using SKAV.Application.DTOs.Gigs;

namespace SKAV.Application.Services.Interface
{
    public interface IGigService
    {
        Task<IEnumerable<GigResponseDto>> GetAllAsync(CancellationToken ct);
        Task<GigResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateGigResponseDto> CreateAsync(CreateGigRequestDto request, CancellationToken ct);
        Task<UpdateGigResponseDto> UpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct);
        Task<DeleteGigResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
