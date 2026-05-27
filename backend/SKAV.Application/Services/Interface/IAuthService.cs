using SKAV.Application.DTOs.Auth;

namespace SKAV.Application.Services.Interface
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken ct);
        Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request, CancellationToken ct);
        Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request, CancellationToken ct);
    }
}
