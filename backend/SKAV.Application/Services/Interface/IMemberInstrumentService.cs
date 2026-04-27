using SKAV.Application.DTOs.MemberInstrument;

namespace SKAV.Application.Services.Interface
{
    public interface IMemberInstrumentService
    {
        Task<IEnumerable<MemberInstrumentResponseDto>> GetAllAsync(CancellationToken ct);
        Task<MemberInstrumentResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateMemberInstrumentResponseDto> CreateAsync(CreateMemberInstrumentRequestDto request, CancellationToken ct);
        Task<UpdateMemberInstrumentResponseDto> UpdateAsync(int id, UpdateMemberInstrumentRequestDto request, CancellationToken ct);
        Task<DeleteMemberInstrumentResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}
