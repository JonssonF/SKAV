using SKAV.Application.DTOs.Auth;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validators.Auth;
using SKAV.Domain.Consts;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class AuthService(
        IUserRepository userRepository,
        IJwtService jwt,
        IAuthValidator validator) : IAuthService
    {
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken ct)
        {
            validator.ValidateLogin(request);

            var user = await userRepository.GetByEmailAsync(request.Email, ct);
            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedException(BusinessRules.InvalidCredentials);

            return new LoginResponseDto { Token = jwt.GenerateToken(user) };
        }
    }
}
