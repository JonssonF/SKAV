using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Instrument;
using SKAV.Application.Services.Interface;

namespace SKAV.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstrumentsController(IInstrumentService service) : ControllerBase
    {

        [HttpGet]
        public async Task<IEnumerable<InstrumentResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        public async Task<InstrumentResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        public async Task<CreateInstrumentResponseDto> Create(CreateInstrumentRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        public async Task<UpdateInstrumentResponseDto> Update(int id, UpdateInstrumentRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        public async Task<DeleteInstrumentResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}
