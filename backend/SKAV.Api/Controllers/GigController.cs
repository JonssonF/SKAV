using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Gigs.Request;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/gigs")]
    [ApiController]
    public class GigsController : ControllerBase
    {
        private readonly IGigService _service;

        public GigsController(IGigService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me([FromServices] ICurrentUserService currentUser)
        {
            return Ok(new { userId = currentUser.UserId });
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
        public async Task<IActionResult> Create(CreateGigRequestDto request, CancellationToken ct)
        {
            var result = await _service.CreateAsync(request, ct);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return CreatedAtAction(nameof(GetById), new { id = result.Data }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateGigRequestDto request, CancellationToken ct)
        {
            var result = await _service.UpdateAsync(id, request, ct);

            if (!result.Success)
            {        
                if (result.Errors?.Any(e => e.Code == "NotFound") == true)
                    return NotFound();

                return BadRequest(new { errors = result.Errors });
            }

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
