using BCrypt.Net;
using SKAV.Application.Common;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator;
using SKAV.Application.Validators.User;
using SKAV.Domain.Entities;
using SKAV.Domain.Enumeration;

namespace SKAV.Application.Services
{
    public class UserService (IUserRepository repo, IUserValidator validator, IUnitOfWorkConnection uow) : IUserService
    {
        private readonly IUserRepository _repo = repo;
        private readonly IUserValidator _validator = validator;
        private readonly IUnitOfWorkConnection _uow = uow;

        public async Task<Result> CreateUserAsync(CreateUserRequest request, CancellationToken ct)
        {
            var errors = await _validator.ValidateCreateUserRequestAsync(request, ct);

            if (errors.Any())
                return Result.Fail(errors);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = Enum.Parse<Roles>(request.Role, ignoreCase: true)
            };

            await _uow.BeginTransactionAsync(ct);

            try
            {
                await _repo.CreateAsync(user, ct);
                await _uow.CommitAsync();
                return Result.Ok();
            }
            catch (Exception)
            {
                await _uow.RollbackAsync();
                throw;
            }
        }
    }
}