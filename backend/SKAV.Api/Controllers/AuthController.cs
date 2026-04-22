using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Auth;
using SKAV.Infrastructure.Repositories;
using SKAV.Infrastructure.Services;

namespace SKAV.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _repo;
        private readonly JwtService _jwt;

        public AuthController(UserRepository repo, JwtService jwt)
        {
            _repo = repo;
            _jwt = jwt;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken ct)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(request?.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email and password are required");

            var user = await _repo.GetByEmailAsync(request.Email, ct);

            // Prevent timing attacks: hash always runs
            bool isValid = user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isValid)
                return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(user);
            return Ok(new { token });
        }
    }
}
