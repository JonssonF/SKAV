using SKAV.Application.Common;
using SKAV.Application.DTOs.Gigs.Request;
using SKAV.Application.DTOs.Gigs.Response;

namespace SKAV.Application.Services.Interface
{
    public interface IGigService
    {
        Task<Result<IEnumerable<GigResponseDto>>> GetAllAsync(CancellationToken ct);
        Task<Result<GigResponseDto>> GetByIdAsync(int id, CancellationToken ct);
        Task<Result<int>> CreateAsync(CreateGigRequestDto request, CancellationToken ct);
        Task<Result> UpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct);
        Task<Result> DeleteAsync(int id, CancellationToken ct);
    }
}
