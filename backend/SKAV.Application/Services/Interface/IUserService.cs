using SKAV.Application.Common;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Validator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Services.Interface
{
    public interface IUserService
    {
        Task<Result> CreateUserAsync(CreateUserRequest request, CancellationToken ct);
    }
}
