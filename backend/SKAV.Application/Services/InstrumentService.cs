using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Instrument;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class InstrumentService : IInstrumentService
    {
        private readonly IInstrumentRepository _repo;
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUser;

        public InstrumentService(IInstrumentRepository repo, IUnitOfWork uow, ICurrentUserService currentUser)
        {
            _repo = repo;
            _uow = uow;
            _currentUser = currentUser;
        }

        public async Task<IEnumerable<InstrumentResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var instruments = await _repo.GetAllAsync(ct);
            return instruments.Select(MapToDto);
        }

        public async Task<InstrumentResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var instrument = await _repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.InstrumentNotFound);
            return MapToDto(instrument);
        }

        public async Task<CreateInstrumentResponseDto> CreateAsync(CreateInstrumentRequestDto request, CancellationToken ct)
        {
            var instrument = new Instrument
            {
                Name = request.Name,
                Description = request.Description
            };
            AuditHelper.SetCreated(instrument, _currentUser.UserId);
            using var scope = _uow.BeginTransactionScope();
            var id = await _repo.CreateAsync(instrument, ct);
            await scope.CommitTransactionScopeAsync(ct);
            return new CreateInstrumentResponseDto { Id = id };
        }

        public async Task<UpdateInstrumentResponseDto> UpdateAsync(int id, UpdateInstrumentRequestDto request, CancellationToken ct)
        {
            var instrument = await _repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.InstrumentNotFound);
            instrument.Name = request.Name;
            instrument.Description = request.Description;
            AuditHelper.SetUpdated(instrument, _currentUser.UserId);
            using var scope = _uow.BeginTransactionScope();
            await _repo.UpdateAsync(instrument, ct);
            await scope.CommitTransactionScopeAsync(ct);
            return new UpdateInstrumentResponseDto();
        }

        public async Task<DeleteInstrumentResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var instrument = await _repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.InstrumentNotFound);
            AuditHelper.SetDeleted(instrument, _currentUser.UserId);
            using var scope = _uow.BeginTransactionScope();
            await _repo.DeleteAsync(id, instrument, ct);
            await scope.CommitTransactionScopeAsync(ct);
            return new DeleteInstrumentResponseDto();
        }

        private static InstrumentResponseDto MapToDto(Instrument i) => new()
        {
            Id = i.Id,
            Name = i.Name,
            Description = i.Description
        };
    }
}
