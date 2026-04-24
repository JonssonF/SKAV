using SKAV.Application.DTOs.Auth;
using SKAV.Application.Validator;

namespace SKAV.Application.Validators.Auth
{
    public interface IAuthValidator
    {
        void ValidateLogin(LoginRequestDto request);
    }
}
