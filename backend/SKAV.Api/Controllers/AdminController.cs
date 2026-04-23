using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Auth;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request, CancellationToken ct)
        {
            var result = await _userService.CreateUserAsync(request, ct);
            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = $"Användare {request.Email} skapad." });
        }
    }
}
