using Microsoft.Extensions.Configuration;
using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validators.Auth;
using SKAV.Domain.Consts;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class AuthService(
        IUserRepository userRepository,
        IJwtService jwt,
        IAuthValidator validator,
        IEmailService emailService,
        IConfiguration configuration,
        IUnitOfWork uow) : IAuthService
    {
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken ct)
        {
            validator.ValidateLogin(request);
            var user = await userRepository.GetByEmailAsync(request.Email, ct);
            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedException(BusinessRules.InvalidCredentials);
            return new LoginResponseDto { Token = jwt.GenerateToken(user) };
        }

        public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(
            ForgotPasswordRequestDto request, CancellationToken ct)
        {
            var user = await userRepository.GetByEmailAsync(request.Email, ct);

            // Returnera alltid OK – avslöja inte om emailen finns
            if (user is null)
                return new ForgotPasswordResponseDto();

            var token = Guid.NewGuid().ToString("N");
            user.ResetToken = token;
            user.ResetTokenExpiry = DateTimeOffset.UtcNow.AddHours(1);

            using var scope = uow.BeginTransactionScope();
            await userRepository.UpdateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            var siteUrl = configuration["Site:BaseUrl"] ?? "https://skav.nu";
            var resetUrl = $"{siteUrl}/reset-password?token={token}";

            var html = NotificationTemplate.ResetPassword(resetUrl);
            await emailService.SendAsync(
                user.Email,
                "Återställ ditt lösenord – SKAV",
                html, ct);

            return new ForgotPasswordResponseDto();
        }

        public async Task<ResetPasswordResponseDto> ResetPasswordAsync(
            ResetPasswordRequestDto request, CancellationToken ct)
        {
            var user = await userRepository.GetByResetTokenAsync(request.Token, ct)
                ?? throw new BusinessRuleException(
                    "Ogiltig eller utgången länk.",
                    BusinessRules.InvalidCredentials);

            if (user.ResetTokenExpiry < DateTimeOffset.UtcNow)
                throw new BusinessRuleException(
                    "Länken har gått ut. Begär en ny.",
                    BusinessRules.InvalidCredentials);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            using var scope = uow.BeginTransactionScope();
            await userRepository.UpdateAsync(user, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new ResetPasswordResponseDto();
        }
    }
}