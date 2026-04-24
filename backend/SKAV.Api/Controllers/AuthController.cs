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
        [HttpPost("login")]
        [SwaggerOperation ("Loggar in en användare och returnerar en JWT-token")]
        public async Task<LoginResponseDto> Login(
            LoginRequestDto request, CancellationToken ct)
            => await authService.LoginAsync(request, ct);
    }
}
