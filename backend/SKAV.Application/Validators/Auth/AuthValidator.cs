using SKAV.Application.DTOs.Auth;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.Auth
{
    public class AuthValidator : IAuthValidator
    {
        public void ValidateLogin(LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                throw new ValidationException("Email", "E-post krävs.");

            if (string.IsNullOrWhiteSpace(request.Password))
                throw new ValidationException("Password", "Lösenord krävs.");
        }
    }
}
