using SKAV.Application.DTOs.User;

namespace SKAV.Application.Services.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllAsync(CancellationToken ct);
        Task<CreateUserResponseDto> CreateAsync(CreateUserRequestDto request, CancellationToken ct);
        Task<DeleteUserResponseDto> DeleteAsync(int id, CancellationToken ct);
        Task<UpdateUserRoleResponseDto> UpdateRoleAsync(int id, UpdateUserRoleRequestDto request, CancellationToken ct);
        Task<ChangePasswordResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken ct);
    }
}
