namespace SKAV.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using SKAV.Application.DTOs.Member;
    using SKAV.Application.Services.Interface;

    [ApiController]
    [Route("api/members")]
    public class MembersController(IMemberService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await service.GetAllAsync(ct));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
            => Ok(await service.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<IActionResult> Create(CreateMemberRequestDto request, CancellationToken ct)
        {
            var id = await service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateMemberRequestDto request, CancellationToken ct)
        {
            await service.UpdateAsync(id, request, ct);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            await service.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}
