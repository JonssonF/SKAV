using SKAV.Application.DTOs.User;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Enumeration;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class UserService(
        IUserRepository repo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IUserService
    {
        public async Task<CreateUserResponseDto> CreateAsync(CreateUserRequestDto request, CancellationToken ct)
        {
            var exists = await repo.EmailExistsAsync(request.Email, ct);
            if (exists)
                throw new BusinessRuleException("E-postadressen används redan.", BusinessRules.EmailAlreadyExists);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = Enum.Parse<Roles>(request.Role, ignoreCase: true)
            };

            using var scope = uow.BeginTransactionScope();
            await repo.CreateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateUserResponseDto
            {
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<DeleteUserResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var user = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteUserResponseDto();
        }

        public async Task<UpdateUserRoleResponseDto> UpdateRoleAsync(int id, UpdateUserRoleRequestDto request, CancellationToken ct)
        {
            var user = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            user.Role = Enum.Parse<Roles>(request.Role, ignoreCase: true);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateUserRoleResponseDto();
        }

        public async Task<ChangePasswordResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken ct)
        {
            var user = await repo.GetByIdAsync(currentUser.UserId, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                throw new BusinessRuleException("Nuvarande lösenord är felaktigt.", BusinessRules.InvalidPassword);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new ChangePasswordResponseDto();
        }
    }
}