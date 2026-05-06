using SKAV.Application.DTOs.User;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Domain.Consts;
using SKAV.Domain.Enumeration;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.User
{
    public class UserValidator(IUserRepository repo) : IUserValidator
    {

        private static readonly Dictionary<Roles, Roles[]> s_allowedRoleTransitions = new()
        {
            [Roles.Admin] = [Roles.Editor, Roles.Member, Roles.Admin],
            [Roles.Editor] = [Roles.Member],
            [Roles.Member] = [],
        };

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

        public void ValidateUpdateRole(UpdateUserRoleRequestDto request, Roles currentUserRole, Roles targetUserRole, bool isSelf)
        {
            ValidateRole(request.Roles);

            // Ingen ändring behövs
            if (targetUserRole == request.Roles)
                return;

            // Editor får demota sig själv till Member
            if (isSelf && currentUserRole == Roles.Editor && request.Roles == Roles.Member)
                return;

            // Ingen annan får ändra sin egen roll
            if (isSelf)
                throw new ForbiddenException(BusinessRules.Forbidden);

            // Kolla om inloggad roll får sätta den nya rollen
            ValidateRoleTransition(currentUserRole, request.Roles);

            // Editor får inte ändra på andra Editors eller Admins
            if (currentUserRole != Roles.Admin && targetUserRole >= currentUserRole)
                throw new ForbiddenException(BusinessRules.Forbidden);
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

        private static void ValidateRoleTransition(Roles currentRole, Roles newRole)
        {
            if (currentRole == newRole)
                return;

            if (!s_allowedRoleTransitions.TryGetValue(currentRole, out Roles[]? allowed) || !allowed.Contains(newRole))
                throw new ForbiddenException(BusinessRules.Forbidden);
        }
    }
}
