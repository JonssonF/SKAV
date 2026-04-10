using SKAV.Application.Common;
using SKAV.Application.DTOs.Gigs.Request;
using SKAV.Application.DTOs.Gigs.Response;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validation;
using SKAV.Application.Validation.Gigs;
using SKAV.Application.Validator;
using SKAV.Application.Validator.Gigs;
using SKAV.Domain.Models;

namespace SKAV.Application.Services;

public class GigService : IGigService
{
    private readonly IGigRepository _repo;
    private readonly IGigValidator _validator;

    public GigService(IGigRepository repo, IGigValidator validator)
    {
        _repo = repo;
        _validator = validator;
    }

    // 🔹 GET ALL
    public async Task<Result<IEnumerable<GigResponseDto>>> GetAllAsync(CancellationToken ct)
    {
        var gigs = await _repo.GetAllGigsAsync(ct);

        var result = gigs
            .Where(g => !g.IsPrivate)
            .OrderBy(g => g.Date)
            .Select(MapToDto);

        return Result<IEnumerable<GigResponseDto>>.Ok(result);
    }

    // 🔹 GET BY ID
    public async Task<Result<GigResponseDto>> GetByIdAsync(int id, CancellationToken ct)
    {
        var gig = await _repo.GetGigByIdAsync(id, ct);

        if (gig is null || gig.IsPrivate)
        {
            return Result<GigResponseDto>.Fail(new List<ValidationError>
            {
                new ValidationError
                {
                    Field = "Id",
                    Message = "Gig hittades inte",
                    Code = "NotFound"
                }
            });
        }

        return Result<GigResponseDto>.Ok(MapToDto(gig));
    }

    // 🔹 CREATE
    public async Task<Result<int>> CreateAsync(CreateGigRequestDto request, CancellationToken ct)
    {
        var errors = await _validator.ValidateCreateAsync(request, ct);

        if (errors.Any())
            return Result<int>.Fail(errors);

        var gig = new Gig
        {
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            Date = request.Date,
            Price = request.Price,
            Notes = request.Notes,
            TicketUrl = request.TicketUrl,
            IsPrivate = false
        };

        var id = await _repo.CreateGigAsync(gig, ct);

        return Result<int>.Ok(id);
    }

    // 🔹 UPDATE
    public async Task<Result> UpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct)
    {
        var existing = await _repo.GetGigByIdAsync(id, ct);

        if (existing is null)
        {
            return Result.Fail(new List<ValidationError>
            {
                new ValidationError
                {
                    Field = "Id",
                    Message = "Gig hittades inte",
                    Code = "NotFound"
                }
            });
        }

        var errors = await _validator.ValidateUpdateAsync(id, request, ct);

        if (errors.Any())
            return Result.Fail(errors);

        existing.Title = request.Title;
        existing.Description = request.Description;
        existing.Location = request.Location;
        existing.Date = request.Date;
        existing.Price = request.Price;
        existing.Notes = request.Notes;
        existing.TicketUrl = request.TicketUrl;

        await _repo.UpdateGigAsync(existing, ct);

        return Result.Ok();
    }

    public async Task<Result> DeleteAsync(int id, CancellationToken ct)
    {
        var existing = await _repo.GetGigByIdAsync(id, ct);

        if (existing is null)
        {
            return Result.Fail(new List<ValidationError>
            {
                new ValidationError
                {
                    Field = "Id",
                    Message = "Gig hittades inte",
                    Code = "NotFound"
                }
            });
        }

        await _repo.DeleteGigAsync(id, ct);

        return Result.Ok();
    }

    private static GigResponseDto MapToDto(Gig g)
    {
        return new GigResponseDto
        {
            Id = g.Id,
            Title = g.Title,
            Description = g.Description,
            Location = g.Location,
            Date = g.Date,
            Price = g.Price,
            Notes = g.Notes,
            TicketUrl = g.TicketUrl
        };
    }
}