using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.User;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UserController(IUserService userService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation("Hämta alla användare")]
        public async Task<IEnumerable<UserResponseDto>> GetAll(CancellationToken ct)
            => await userService.GetAllAsync(ct);

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation("Skapa en ny användare")]
        public async Task<CreateUserResponseDto> Create(
            CreateUserRequestDto request, CancellationToken ct)
            => await userService.CreateAsync(request, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation("Ta bort en användare")]
        public async Task<DeleteUserResponseDto> Delete(
            int id, CancellationToken ct)
            => await userService.DeleteAsync(id, ct);

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation("Uppdatera en användares roll")]
        public async Task<UpdateUserRoleResponseDto> UpdateRole(
            int id, UpdateUserRoleRequestDto request, CancellationToken ct)
            => await userService.UpdateRoleAsync(id, request, ct);

        [HttpPut("me/password")]
        [SwaggerOperation("Byt lösenord för inloggad användare")]
        public async Task<ChangePasswordResponseDto> ChangePassword(
            ChangePasswordRequestDto request, CancellationToken ct)
            => await userService.ChangePasswordAsync(request, ct);
    }
}
