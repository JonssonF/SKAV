using SKAV.Application.Common;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator;

namespace SKAV.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwt;

        public AuthService(IUserService userService, IJwtService jwt)
        {
            _userService = userService;
            _jwt = jwt;
        }

        public async Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return Result<LoginResponseDto>.Fail("Email and password are required");

            var user = await _userService.GetByEmailAsync(request.Email, ct);

            ValidateUser(user);

            bool isValid = user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isValid)
                return Result<LoginResponseDto>.Fail(new List<ValidationError>
                {
                  new ValidationError
                  {
                    Message = "Invalid credentials",
                    Code = "INVALID_CREDENTIALS"
                  }
                });

            var token = _jwt.GenerateToken(user);

            return Result<LoginResponseDto>.Ok(new LoginResponseDto
            {
                Token = token
            });
        }
    }
}
