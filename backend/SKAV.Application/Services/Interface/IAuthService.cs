using SKAV.Application.Common;
using SKAV.Application.DTOs.Auth;

namespace SKAV.Application.Services.Interface
{
    public interface IAuthService
    {
        Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto request, CancellationToken ct);
    }
}
