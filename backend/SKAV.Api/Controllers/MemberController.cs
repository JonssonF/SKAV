namespace SKAV.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using SKAV.Application.DTOs.Member;
    using SKAV.Application.Services.Interface;

    [ApiController]
    [Route("api/members")]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _service;

        public MembersController(IMemberService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result.Data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);

            if (!result.Success)
                return NotFound();

            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateMemberRequestDto request, CancellationToken ct)
        {
            var result = await _service.CreateAsync(request, ct);

            return CreatedAtAction(nameof(GetById), new { id = result.Data }, null);
        }
      
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateMemberRequestDto request, CancellationToken ct)
        {
            var result = await _service.UpdateAsync(id, request, ct);

            if (!result.Success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);

            if (!result.Success)
                return NotFound();

            return NoContent();
        }
    }
}
