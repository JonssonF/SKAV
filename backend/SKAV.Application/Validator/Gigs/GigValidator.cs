using SKAV.Application.DTOs.Gigs.Request;
using SKAV.Application.Interfaces;
using SKAV.Application.Validation;
using SKAV.Application.Validator;
using SKAV.Application.Validator.Gigs;

namespace SKAV.Application.Validation.Gigs;

public class GigValidator : IGigValidator
{
    private readonly IGigRepository _repo;

    public GigValidator(IGigRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<ValidationError>> ValidateCreateAsync(CreateGigRequestDto request, CancellationToken ct)
    {
        var errors = new List<ValidationError>();

        ValidateDate(request.Date, errors);
        await ValidateExist(request.Title, request.Date, null, errors, ct);

        return errors;
    }

    public async Task<List<ValidationError>> ValidateUpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct)
    {
        var errors = new List<ValidationError>();

        ValidateDate(request.Date, errors);
        await ValidateExist(request.Title, request.Date, id, errors, ct);

        return errors;
    }

    private void ValidateDate(DateTimeOffset date, List<ValidationError> errors)
    {
        var now = DateTimeOffset.UtcNow;

        if (date < now)
        {
            errors.Add(new ValidationError
            {
                Field = "Date",
                Message = "Datum kan inte vara i det förflutna",
                Code = "InvalidDatePast"
            });
        }

        if (date > now.AddYears(1))
        {
            errors.Add(new ValidationError
            {
                Field = "Date",
                Message = "Datum får max vara ett år framåt",
                Code = "InvalidDateFuture"
            });
        }
    }

    private async Task ValidateExist(string title, DateTimeOffset date, int? excludeId,
        List<ValidationError> errors, CancellationToken ct)
    {
        var exists = await _repo.ExistsAsync(title, date, excludeId, ct);

        if (exists)
        {
            errors.Add(new ValidationError
            {
                Field = "Title",
                Message = "Gig med samma titel och datum finns redan",
                Code = "GigAlreadyExists"
            });
        }
    }
}