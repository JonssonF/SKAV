namespace SKAV.Application.Services.Interface
{
    public interface IInstrumentService
    {
        Task<IEnumerable<InstrumentResponseDto>> GetAllAsync(CancellationToken ct);
        Task<InstrumentResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateInstrumentResponseDto> CreateAsync(CreateInstrumentRequestDto request, CancellationToken ct);
        Task<UpdateInstrumentResponseDto> UpdateAsync(int id, UpdateInstrumentRequestDto request, CancellationToken ct);
        Task<DeleteInstrumentResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
