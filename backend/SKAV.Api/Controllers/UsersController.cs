using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Member;
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
        [SwaggerOperation("Hämta alla användare")]
        [Authorize(Roles = "Admin,Editor,Member")]
        public async Task<IEnumerable<UserResponseDto>> GetAll(CancellationToken ct)
            => await userService.GetAllAsync(ct);

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Skapa en ny användare")]
        public async Task<CreateUserResponseDto> Create(
            CreateUserRequestDto request, CancellationToken ct)
            => await userService.CreateAsync(request, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Ta bort en användare")]
        public async Task<DeleteUserResponseDto> Delete(
            int id, CancellationToken ct)
            => await userService.DeleteAsync(id, ct);

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Uppdatera en användares roll")]
        public async Task<UpdateUserRoleResponseDto> UpdateRole(
            int id, UpdateUserRoleRequestDto request, CancellationToken ct)
            => await userService.UpdateRoleAsync(id, request, ct);

        [HttpPut("me/password")]
        [SwaggerOperation("Byt lösenord för inloggad användare")]
        public async Task<ChangePasswordResponseDto> ChangePassword(
            ChangePasswordRequestDto request, CancellationToken ct)
            => await userService.ChangePasswordAsync(request, ct);

        [HttpPut("{id}/link-member")]
        [Authorize(Roles = "Admin,Editor,Member")]
        [SwaggerOperation("Koppla en användare till en bandmedlem")]
        public async Task<LinkMemberResponseDto> LinkMember(
            int id, LinkMemberRequestDto request, CancellationToken ct)
            => await userService.LinkMemberAsync(id, request, ct);

        [HttpPut("{id}/unlink-member")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Bryt kopplingen mellan användare och bandmedlem")]
        public async Task<UnlinkMemberResponseDto> UnlinkMember(
            int id, CancellationToken ct)
            => await userService.UnlinkMemberAsync(id, ct);
    }
}
