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
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IEnumerable<UserResponseDto>> GetAll(CancellationToken ct)
            => await userService.GetAllAsync(ct);

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<CreateUserResponseDto> Create(
            CreateUserRequestDto request, CancellationToken ct)
            => await userService.CreateAsync(request, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<DeleteUserResponseDto> Delete(
            int id, CancellationToken ct)
            => await userService.DeleteAsync(id, ct);

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<UpdateUserRoleResponseDto> UpdateRole(
            int id, UpdateUserRoleRequestDto request, CancellationToken ct)
            => await userService.UpdateRoleAsync(id, request, ct);

        [HttpPut("me/password")]
        public async Task<ChangePasswordResponseDto> ChangePassword(
            ChangePasswordRequestDto request, CancellationToken ct)
            => await userService.ChangePasswordAsync(request, ct);
    }
}
