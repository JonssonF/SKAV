using SKAV.Application.DTOs.Gigs;

namespace SKAV.Application.Validator.Gigs
{
    public interface IGigValidator
    {
        Task ValidateCreateAsync(CreateGigRequestDto request, CancellationToken ct);
        Task ValidateUpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct);
    }
}
