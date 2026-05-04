using SKAV.Application.DTOs.Member;

namespace SKAV.Application.Validators.Members
{
    public interface IMemberValidator
    {
        Task ValidateCreateAsync(CreateMemberRequestDto request, CancellationToken ct);
        Task ValidateUpdateAsync(int id, UpdateMemberRequestDto request, CancellationToken ct);
    }
}
