using SKAV.Application.DTOs.Gigs;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Validator.Gigs;
using SKAV.Domain.Consts;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.Gigs;

public class GigValidator(IGigRepository repo) : IGigValidator
{
    public async Task ValidateCreateAsync(CreateGigRequestDto request, CancellationToken ct)
    {
        ValidateDate(request.Date);
        await ValidateExistsAsync(request.Title, request.Date, null, ct);
    }

    public async Task ValidateUpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct)
    {
        ValidateDate(request.Date);
        await ValidateExistsAsync(request.Title, request.Date, id, ct);
    }

    private static void ValidateDate(DateTimeOffset date)
    {
        var now = DateTimeOffset.UtcNow;

        if (date < now)
            throw new ValidationException("Date", "Datum kan inte vara i det förflutna.");

        if (date > now.AddYears(2))
            throw new ValidationException("Date", "Datum får max vara två år framåt.");
    }

    private async Task ValidateExistsAsync(string title, DateTimeOffset date, int? excludeId, CancellationToken ct)
    {
        var exists = await repo.ExistsByTitleAndDateAsync(title, date, excludeId, ct);
        if (exists)
            throw new BusinessRuleException(
                "Gig med samma titel och datum finns redan.",
                BusinessRules.GigAlreadyExists);
    }
}
