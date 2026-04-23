using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("login")]
        [SwaggerOperation ("Loggar in en användare")]
        public async Task<LoginResponseDto> Login(
            LoginRequestDto request, CancellationToken ct)
            => await _authService.LoginAsync(request, ct);
    }
}
