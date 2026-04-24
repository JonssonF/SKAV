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
        public async Task<CreateUserResponseDto> CreateUser(
            CreateUserRequestDto request, CancellationToken ct)
            => await userService.CreateAsync(request, ct);

        [HttpDelete("users/{id}")]
        public async Task<DeleteUserResponseDto> DeleteUser(
            int id, CancellationToken ct)
            => await userService.DeleteAsync(id, ct);

        [HttpPut("users/{id}/role")]
        public async Task<UpdateUserRoleResponseDto> UpdateRole(
            int id, UpdateUserRoleRequestDto request, CancellationToken ct)
            => await userService.UpdateRoleAsync(id, request, ct);
    }
}

