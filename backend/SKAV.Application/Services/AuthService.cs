using SKAV.Application.Common;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator;
using SKAV.Application.Validators.Auth;

namespace SKAV.Application.Services
{
    public class AuthService(IUserRepository userRepository, IJwtService jwt, IAuthValidator validator) : IAuthService
    {
        private readonly IAuthValidator _validator = validator;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IJwtService _jwt = jwt;

        public async Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto request, CancellationToken ct)
        {
            
            var errors = _validator.ValidateLoginAsync(request, ct);
            if (errors.Any())
                return Result<LoginResponseDto>.Fail(errors);

            var user = await _userRepository.GetByEmailAsync(request.Email, ct);
            
            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Result<LoginResponseDto>.Fail(
                [
                    new ValidationError
                    {
                        Message = "Invalid credentials",
                        Code = "INVALID_CREDENTIALS"
                    }
                ]);
            }
            
            var token = _jwt.GenerateToken(user);

            return Result<LoginResponseDto>.Ok(new LoginResponseDto
            {
                Token = token
            });
        }
    }
}
