using SKAV.Application.Common;
using SKAV.Application.DTOs.Auth;

namespace SKAV.Application.Services.Interface
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken ct);
    }
}
