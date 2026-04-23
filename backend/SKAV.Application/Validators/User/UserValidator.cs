using SKAV.Application.DTOs.Auth;
using SKAV.Application.Interfaces;
using SKAV.Domain.Enumeration;

namespace SKAV.Application.Validator.User
{
    public class UserValidator : IUserValidator
    {
        private readonly IUserRepository _userRepository;

        public UserValidator(IUserRepository repo)
        {
            _userRepository = repo;
        }

        public async Task<List<ValidationError>> ValidateCreateUserRequestAsync(CreateUserRequest request, CancellationToken ct)
        {
            var errors = new List<ValidationError>();

            ValidateEmail(request.Email, errors);
            ValidatePassword(request.Password, errors);
            ValidateRole(request.Role, errors);

            if (errors.Count == 0)
                await ValidateEmailExistsAsync(request.Email, errors, ct);

            return errors;
        }

        private void ValidateEmail(string email, List<ValidationError> errors)
        {
            if (string.IsNullOrWhiteSpace(email))
                errors.Add(new ValidationError { Field = "Email", Message = "Email krävs.", Code = "EmailRequired" });
        }

        private void ValidatePassword(string password, List<ValidationError> errors)
        {
            if (string.IsNullOrWhiteSpace(password))
                errors.Add(new ValidationError { Field = "Password", Message = "Lösenord krävs.", Code = "PasswordRequired" });
            else if (password.Length < 8)
                errors.Add(new ValidationError { Field = "Password", Message = "Lösenord måste vara minst 8 tecken.", Code = "PasswordTooShort" });
        }

        private void ValidateRole(string role, List<ValidationError> errors)
        {
            if (!Enum.TryParse<Roles>(role, ignoreCase: true, out _))
                errors.Add(new ValidationError
                {
                    Field = "Role",
                    Message = $"Ogiltig roll. Tillåtna värden: {string.Join(", ", Enum.GetNames<Roles>())}",
                    Code = "InvalidRole"
                });
        }

        private async Task ValidateEmailExistsAsync(string email, List<ValidationError> errors, CancellationToken ct)
        {
            if (await _userRepository.EmailExistsAsync(email, ct))
                errors.Add(new ValidationError { Field = "Email", Message = "Email är redan registrerad.", Code = "EmailAlreadyExists" });
        }
    }
}
