using SKAV.Application.DTOs.Auth;
using SKAV.Application.Validator;

namespace SKAV.Application.Validators.User
{
    public interface IUserValidator
    {
        Task<List<ValidationError>> ValidateCreateUserRequestAsync(CreateUserRequest request, CancellationToken ct);
        //Task<List<ValidationError>> ValidateUpdateUserRequestAsync(UpdateUserRequest request, CancellationToken ct);
        //Task<List<ValidationError>> ValidateUserRequestAsync(User request, CancellationToken ct);
    }
}
