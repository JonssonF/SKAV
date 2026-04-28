using SKAV.Application.DTOs.Auth;

namespace SKAV.Application.Validators.Auth
{
    public interface IAuthValidator
    {
        void ValidateLogin(LoginRequestDto request);
    }
}
