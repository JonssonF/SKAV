using SKAV.Application.DTOs.Gigs.Request;

namespace SKAV.Application.Validator.Gigs
{
    public interface IGigValidator
    {
        Task<List<ValidationError>> ValidateCreateAsync(CreateGigRequestDto request, CancellationToken ct);
        Task<List<ValidationError>> ValidateUpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct);
    }
}
