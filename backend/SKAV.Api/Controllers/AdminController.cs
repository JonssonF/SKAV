using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.User;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController(IUserService userService) : ControllerBase
    {
        [HttpPost("users")]
        public async Task<CreateUserResponseDto> CreateUser([FromBody] CreateUserRequestDto request, CancellationToken ct)
            =>await userService.CreateAsync(request, ct);
    }
}

