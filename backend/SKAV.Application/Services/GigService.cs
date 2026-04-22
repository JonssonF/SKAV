using SKAV.Application.Common;
using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Gigs.Request;
using SKAV.Application.DTOs.Gigs.Response;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator;
using SKAV.Application.Validator.Gigs;
using SKAV.Domain.Entities;

namespace SKAV.Application.Services;

public class GigService : IGigService
{
    private readonly ICurrentUserService _currentUser;
    private readonly IGigRepository _repo;
    private readonly IGigValidator _validator;
    private readonly IUnitOfWorkConnection _uow;

    public GigService(IGigRepository repo, IGigValidator validator, IUnitOfWorkConnection uow, ICurrentUserService currentUser)
    {

        _currentUser = currentUser;
        _repo = repo;
        _validator = validator;
        _uow = uow;
    }
    public async Task<Result<IEnumerable<GigResponseDto>>> GetAllAsync(CancellationToken ct)
    {
        var gigs = await _repo.GetAllGigsAsync(ct);

        var result = gigs
            .Where(g => !g.IsPrivate)
            .OrderBy(g => g.Date)
            .Select(MapToDto);

        return Result<IEnumerable<GigResponseDto>>.Ok(result);
    }
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
            Adress = request.Adress,
            Date = request.Date,
            Price = request.Price,
            Notes = request.Notes,
            TicketUrl = request.TicketUrl,
            IsPrivate = false
        };

        AuditHelper.SetCreated(gig, _currentUser.UserId);
        await _uow.BeginTransactionAsync(ct);

        try
        {
        var id = await _repo.CreateGigAsync(gig, ct);
            await _uow.CommitAsync();
            return Result<int>.Ok(id);
        }
        catch (Exception)
        {
            await _uow.RollbackAsync();
            throw;
        }

    }

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
        existing.Adress = request.Adress;
        existing.Date = request.Date;
        existing.Price = request.Price;
        existing.Notes = request.Notes;
        existing.TicketUrl = request.TicketUrl;

        AuditHelper.SetUpdated(existing, _currentUser.UserId);
        
        await _uow.BeginTransactionAsync(ct);

        try
        {
            await _repo.UpdateGigAsync(existing, ct);
            await _uow.CommitAsync();
            return Result.Ok();
        }
        catch (Exception)
        {
            await _uow.RollbackAsync();
            throw;
        }
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

        AuditHelper.SetDeleted(existing, _currentUser.UserId);

        await _uow.BeginTransactionAsync(ct);

        try
        {
            await _repo.DeleteGigAsync(id, ct);
            await _uow.CommitAsync();
            return Result.Ok();

        }
        catch (Exception)
        {
            await _uow.RollbackAsync();
            throw;
        }


    }

    private static GigResponseDto MapToDto(Gig g)
    {
        return new GigResponseDto
        {
            Id = g.Id,
            Title = g.Title,
            Description = g.Description,
            Location = g.Location,
            Adress = g.Adress,
            Date = g.Date,
            Price = g.Price,
            Notes = g.Notes,
            TicketUrl = g.TicketUrl
        };
    }
}