using SKAV.Application.DTOs.User;
using SKAV.Application.Validator;

namespace SKAV.Application.Validators.User
{
    public interface IUserValidator
    {
        Task ValidateCreateAsync(CreateUserRequestDto request, CancellationToken ct);
        Task ValidateChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken ct);
        void ValidateUpdateRole(UpdateUserRoleRequestDto request);
    }
}
