using SKAV.Application.DTOs.Auth;
using SKAV.Application.Validator;

namespace SKAV.Application.Validators.Auth
{
    public class AuthValidator : IAuthValidator
    {
        public List<ValidationError> ValidateLoginAsync(
        LoginRequestDto request, CancellationToken ct)
        {
            var errors = new List<ValidationError>();

            if (string.IsNullOrWhiteSpace(request.Email))
            {
                errors.Add(new ValidationError
                {
                    Field = "Email",
                    Message = "Email krävs",
                    Code = "REQUIRED"
                });
            }

            if (string.IsNullOrWhiteSpace(request.Password))
            {
                errors.Add(new ValidationError
                {
                    Field = "Password",
                    Message = "Lösenord krävs",
                    Code = "REQUIRED"
                });
            }
            return errors;
        }
    }
}
