using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.User;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UserController(IUserService userService) : ControllerBase
    {
        [HttpPut("me/password")]
        public async Task<ChangePasswordResponseDto> ChangePassword(
            ChangePasswordRequestDto request, CancellationToken ct)
            => await userService.ChangePasswordAsync(request, ct);
    }
}
