using SKAV.Application.DTOs.User;
using SKAV.Domain.Enumeration;

namespace SKAV.Application.Validators.User
{
    public interface IUserValidator
    {
        Task ValidateCreateAsync(CreateUserRequestDto request, CancellationToken ct);
        Task ValidateChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken ct);
        void ValidateUpdateRole(UpdateUserRoleRequestDto request, Roles currentUserRole, Roles targetUserRole, bool isSelf);
    }
}
