using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
 
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
