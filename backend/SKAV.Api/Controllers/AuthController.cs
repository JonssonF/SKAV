using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(
            [FromBody]LoginRequestDto request, CancellationToken ct)
        {
            var result = await _authService.LoginAsync(request, ct);
            
            if (!result.Success)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Data);
        }
    }
}
