namespace SKAV.Api.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using SKAV.Application.DTOs.Member;
    using SKAV.Application.Services.Interface;
    using Swashbuckle.AspNetCore.Annotations;

    [Route("api/members")]
    [ApiController]
    public class MembersController(IMemberService service) : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation("Hämta alla medlemmar")]
        public async Task<IEnumerable<MemberResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [SwaggerOperation("Hämta en medlem baserat på ID")]
        public async Task<MemberResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Skapa en ny medlem")]
        public async Task<CreateMemberResponseDto> Create(CreateMemberRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Uppdatera en befintlig medlem")]
        public async Task<UpdateMemberResponseDto> Update(int id, UpdateMemberRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Ta bort en befintlig medlem")]
        public async Task<DeleteMemberResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}
