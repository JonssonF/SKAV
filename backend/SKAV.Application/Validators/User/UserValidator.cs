using SKAV.Application.DTOs.User;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Domain.Consts;
using SKAV.Domain.Enumeration;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.User
{
    public class UserValidator(IUserRepository repo) : IUserValidator
    {
        public async Task ValidateCreateAsync(CreateUserRequestDto request, CancellationToken ct)
        {
            ValidateEmail(request.Email);
            ValidatePassword(request.Password);
            ValidateRole(request.Roles);
            await ValidateEmailNotTakenAsync(request.Email, ct);
        }

        public Task ValidateChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken ct)
        {
            ValidatePassword(request.NewPassword);

            if (request.NewPassword != request.ConfirmNewPassword)
               throw new ValidationException("ConfirmNewPassword", "Lösenorden matchar inte.");

            return Task.CompletedTask;
        }

        public void ValidateUpdateRole(UpdateUserRoleRequestDto request)
        {
            ValidateRole(request.Roles);
        }

        private static void ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ValidationException("Email", "E-post krävs.");
        }

        private static void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new ValidationException("Password", "Lösenord krävs.");

            if (password.Length < 8)
                throw new ValidationException("Password", "Lösenord måste vara minst 8 tecken.");
        }

        private static void ValidateRole(Roles role)
        {
            if (!Enum.IsDefined(typeof(Roles), role))
                throw new ValidationException("Role",
                    $"Ogiltig roll. Tillåtna värden: {string.Join(", ", Enum.GetNames<Roles>())}.");
        }

        private async Task ValidateEmailNotTakenAsync(string email, CancellationToken ct)
        {
            if (await repo.EmailExistsAsync(email, ct))
                throw new BusinessRuleException(
                    "E-postadressen används redan.",
                    BusinessRules.EmailAlreadyExists);
        }
    }
}
