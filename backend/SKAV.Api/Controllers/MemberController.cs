namespace SKAV.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using SKAV.Application.DTOs.Member;
    using SKAV.Application.Services.Interface;
    using Swashbuckle.AspNetCore.Annotations;

    [ApiController]
    [Route("api/members")]
    public class MembersController(IMemberService service) : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation("Hämta alla medlemmar")]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await service.GetAllAsync(ct));

        [HttpGet("{id}")]
        [SwaggerOperation("Hämta en medlem baserat på ID")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
            => Ok(await service.GetByIdAsync(id, ct));

        [HttpPost]
        [SwaggerOperation("Skapa en ny medlem")]
        public async Task<IActionResult> Create(CreateMemberRequestDto request, CancellationToken ct)
        {
            var id = await service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id }, null);
        }

        [HttpPut("{id}")]
        [SwaggerOperation("Uppdatera en befintlig medlem")]
        public async Task<IActionResult> Update(int id, UpdateMemberRequestDto request, CancellationToken ct)
        {
            await service.UpdateAsync(id, request, ct);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [SwaggerOperation("Ta bort en befintlig medlem")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            await service.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}
