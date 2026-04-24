using SKAV.Application.Common;
using SKAV.Application.DTOs.Member;
using SKAV.Domain.Entities;

namespace SKAV.Application.Services.Interface
{
    public interface IMemberService
    {
        Task<IEnumerable<MemberResponseDto>> GetAllAsync(CancellationToken ct);
        Task<MemberResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateMemberResponseDto> CreateAsync(CreateMemberRequestDto request, CancellationToken ct);
        Task<UpdateMemberResponseDto> UpdateAsync(int id, UpdateMemberRequestDto request, CancellationToken ct);
        Task<DeleteMemberResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
