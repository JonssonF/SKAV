using SKAV.Application.Common;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator;
using SKAV.Application.Validators.Auth;
using System.Data.Common;

namespace SKAV.Application.Services
{
    public class AuthService(
        IUserRepository userRepository, 
        IJwtService jwt, 
        IAuthValidator validator, 
        IUnitOfWorkConnection connection) : IAuthService
    {
        private readonly IAuthValidator _validator = validator;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IJwtService _jwt = jwt;
        private readonly IUnitOfWorkConnection _connection = connection;

        public async Task<LoginResponseDto> LoginAsync(
            LoginRequestDto request, CancellationToken ct)
        {
            await _connection.BeginTransactionAsync(ct);

            try
            {
                var errors = _validator.ValidateLoginAsync(request, ct);
                if (errors.Any())
                    throw new Exception("Validation failed");

                var user = await _userRepository.GetByEmailAsync(request.Email, ct);

                if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    throw new Exception("Invalid credentials");

                var token = _jwt.GenerateToken(user);

                await _connection.CommitAsync();

                return new LoginResponseDto
                {
                    Token = token
                };
            }
            catch
            {
                await _connection.RollbackAsync();
                throw;
            }
        }
    }
}
