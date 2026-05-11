using SKAV.Application.DTOs.Member;
using SKAV.Application.DTOs.User;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validators.User;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class UserService(
        IUserRepository repo,
        IUnitOfWork uow,
        ICurrentUserService currentUser,
        IMemberRepository memberRepo,
        IUserValidator validator) : IUserService
    {
        public async Task<CreateUserResponseDto> CreateAsync(CreateUserRequestDto request, CancellationToken ct)
        {
            var exists = await repo.EmailExistsAsync(request.Email, ct);
            if (exists)
                throw new BusinessRuleException("E-postadressen används redan.", BusinessRules.EmailAlreadyExists);
            await validator.ValidateCreateAsync(request, ct);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Roles = request.Roles
            };

            using var scope = uow.BeginTransactionScope();
            await repo.CreateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateUserResponseDto
            {
                Email = user.Email,
                Roles = user.Roles
            };
        }

        public async Task<DeleteUserResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var user = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteUserResponseDto();
        }

        public async Task<UpdateUserRoleResponseDto> UpdateRoleAsync(int id, UpdateUserRoleRequestDto request, CancellationToken ct)
        {
            var user = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            var isSelf = user.Id == currentUser.UserId;
            validator.ValidateUpdateRole(request, currentUser.Roles, user.Roles, isSelf);

            user.Roles = request.Roles;

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateUserRoleResponseDto();
        }

        public async Task<ChangePasswordResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken ct)
        {
            var userId = currentUser.UserId
                ?? throw new BusinessRuleException("Användaren är inte inloggad.", BusinessRules.InvalidCredentials);

            var user = await repo.GetByIdAsync(userId, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                throw new BusinessRuleException("Nuvarande lösenord är felaktigt.", BusinessRules.InvalidPassword);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new ChangePasswordResponseDto();
        }
        
        public async Task<IEnumerable<UserResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var users = await repo.GetAllAsync(ct);
            var members = await memberRepo.GetAllAsync(ct);
            var memberLookup = members.ToDictionary(m => m.Id, m => m.Name);

            return users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Email = u.Email,
                Roles = u.Roles,
                MemberId = u.MemberId,
                MemberName = u.MemberId.HasValue && memberLookup.ContainsKey(u.MemberId.Value)
                    ? memberLookup[u.MemberId.Value]
                    : null,
            });
        }

        public async Task<LinkMemberResponseDto> LinkMemberAsync(int userId, LinkMemberRequestDto request, CancellationToken ct)
        {
            var user = await repo.GetByIdAsync(userId, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            if (user.MemberId.HasValue)
                throw new BusinessRuleException(
                    "Användaren är redan kopplad till en medlem.",
                    BusinessRules.UserAlreadyLinked);

            var member = await memberRepo.GetByIdAsync(request.MemberId, ct)
                ?? throw new NotFoundException(BusinessRules.MemberNotFound);

            if (member.UserId.HasValue)
                throw new BusinessRuleException(
                    "Medlemmen är redan kopplad till en användare.",
                    BusinessRules.MemberAlreadyLinked);

            user.MemberId = member.Id;
            member.UserId = user.Id;

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(user, ct);
            await memberRepo.UpdateAsync(member, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new LinkMemberResponseDto();
        }

        public async Task<UnlinkMemberResponseDto> UnlinkMemberAsync(int userId, CancellationToken ct)
        {
            var user = await repo.GetByIdAsync(userId, ct)
                ?? throw new NotFoundException(BusinessRules.UserNotFound);

            if (!user.MemberId.HasValue)
                throw new BusinessRuleException(
                    "Användaren är inte kopplad till någon medlem.",
                    BusinessRules.UserNotLinked);

            var member = await memberRepo.GetByIdAsync(user.MemberId.Value, ct)
                ?? throw new NotFoundException(BusinessRules.MemberNotFound);

            user.MemberId = null;
            member.UserId = null;

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(user, ct);
            await memberRepo.UpdateAsync(member, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UnlinkMemberResponseDto();
        }
    }
}