using SKAV.Application.Common;
using SKAV.Application.DTOs.Member;
using SKAV.Domain.Models;

namespace SKAV.Application.Services.Interface
{
    public interface IMemberService
    {
        Task<Result<IEnumerable<MemberResponseDto>>> GetAllAsync(CancellationToken ct);

        Task<Result<MemberResponseDto>> GetByIdAsync(int id, CancellationToken ct);

        Task<Result<int>> CreateAsync(CreateMemberRequestDto request, CancellationToken ct);

        Task<Result> UpdateAsync(int id, CreateMemberRequestDto request, CancellationToken ct);

        Task<Result> DeleteAsync(int id, CancellationToken ct);
    }
}
