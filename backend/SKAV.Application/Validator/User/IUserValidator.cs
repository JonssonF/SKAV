using SKAV.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Validator.User
{
    public interface IUserValidator
    {
        Task<List<ValidationError>> ValidateCreateUserRequestAsync(CreateUserRequest request, CancellationToken ct);
        Task<List<ValidationError>> ValidateUpdateUserRequestAsync(UpdateUserRequest request, CancellationToken ct);
        Task<List<ValidationError>> ValidateUserRequestAsync(User request, CancellationToken ct);
    }
}
