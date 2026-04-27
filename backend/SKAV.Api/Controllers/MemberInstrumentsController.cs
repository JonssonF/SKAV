using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.MemberInstrument;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberInstrumentsController(IMemberInstrumentService service) : ControllerBase
    {

        [HttpGet]
        public async Task<IEnumerable<MemberInstrumentResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        public async Task<MemberInstrumentResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        public async Task<CreateMemberInstrumentResponseDto> Create(CreateMemberInstrumentRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        public async Task<UpdateMemberInstrumentResponseDto> Update(int id, UpdateMemberInstrumentRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        public async Task<DeleteMemberInstrumentResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}
