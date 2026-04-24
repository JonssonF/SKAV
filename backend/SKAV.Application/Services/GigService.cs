using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Gigs;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator.Gigs;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services;

public class GigService(
    IGigRepository repo,
    IGigValidator validator,
    IUnitOfWork uow,
    ICurrentUserService currentUser) : IGigService
{
    public async Task<IEnumerable<GigResponseDto>> GetAllAsync(CancellationToken ct)
    {
        var gigs = await repo.GetAllAsync(ct);

        return gigs
            .OrderBy(g => g.Date)
            .Select(MapToDto);
    }

    public async Task<GigResponseDto> GetByIdAsync(int id, CancellationToken ct)
    {
        var gig = await repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(BusinessRules.GigNotFound);

        return MapToDto(gig);
    }

    public async Task<CreateGigResponseDto> CreateAsync(CreateGigRequestDto request, CancellationToken ct)
    {
        await validator.ValidateCreateAsync(request, ct);

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
        };

        AuditHelper.SetCreated(gig, currentUser.UserId);

        using var scope = uow.BeginTransactionScope();
        var id = await repo.CreateAsync(gig, ct);
        await scope.CommitTransactionScopeAsync(ct);

        return new CreateGigResponseDto { Id = id };
    }

    public async Task<UpdateGigResponseDto> UpdateAsync(int id, UpdateGigRequestDto request, CancellationToken ct)
    {
        var existing = await repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(BusinessRules.GigNotFound);

        await validator.ValidateUpdateAsync(id, request, ct);

        existing.Title = request.Title;
        existing.Description = request.Description;
        existing.Location = request.Location;
        existing.Adress = request.Adress;
        existing.Date = request.Date;
        existing.Price = request.Price;
        existing.Notes = request.Notes;
        existing.TicketUrl = request.TicketUrl;

        AuditHelper.SetUpdated(existing, currentUser.UserId);

        using var scope = uow.BeginTransactionScope();
        await repo.UpdateAsync(existing, ct);
        await scope.CommitTransactionScopeAsync(ct);

        return new UpdateGigResponseDto();
    }

    public async Task<DeleteGigResponseDto> DeleteAsync(int id, CancellationToken ct)
    {
        var existing = await repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(BusinessRules.GigNotFound);

        AuditHelper.SetDeleted(existing, currentUser.UserId);

        using var scope = uow.BeginTransactionScope();
        await repo.DeleteAsync(id, existing, ct);
        await scope.CommitTransactionScopeAsync(ct);

        return new DeleteGigResponseDto();
    }

    private static GigResponseDto MapToDto(Gig g) => new()
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