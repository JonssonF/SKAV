using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.MemberInstrument;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Services
{
    public class MemberInstrumentService : IMemberInstrumentService
    {
        private readonly IMemberInstrumentRepository _repo;
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUser;

        public MemberInstrumentService(IMemberInstrumentRepository repo, IUnitOfWork uow, ICurrentUserService currentUser)
        {
            _repo = repo;
            _uow = uow;
            _currentUser = currentUser;
        }

        public async Task<IEnumerable<MemberInstrumentResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var memberInstruments = await _repo.GetAllAsync(ct);
            return memberInstruments.Select(MapToDto);
        }

        public async Task<MemberInstrumentResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var memberInstrument = await _repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberInstrumentNotFound);
            return MapToDto(memberInstrument);
        }

        public async Task<CreateMemberInstrumentResponseDto> CreateAsync(CreateMemberInstrumentRequestDto request, CancellationToken ct)
        {
            var memberInstrument = new MemberInstrument
            {
                MemberId = request.MemberId,
                InstrumentId = request.InstrumentId,
                Details = request.Details
            };
            AuditHelper.SetCreated(memberInstrument, _currentUser.UserId);
            using var scope = _uow.BeginTransactionScope();
            var id = await _repo.CreateAsync(memberInstrument, ct);
            await scope.CommitTransactionScopeAsync(ct);
            return new CreateMemberInstrumentResponseDto { Id = id };
        }

        public async Task<UpdateMemberInstrumentResponseDto> UpdateAsync(int id, UpdateMemberInstrumentRequestDto request, CancellationToken ct)
        {
            var memberInstrument = await _repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberInstrumentNotFound);
            memberInstrument.MemberId = request.MemberId;
            memberInstrument.InstrumentId = request.InstrumentId;
            memberInstrument.Details = request.Details;
            AuditHelper.SetUpdated(memberInstrument, _currentUser.UserId);
            using var scope = _uow.BeginTransactionScope();
            await _repo.UpdateAsync(memberInstrument, ct);
            await scope.CommitTransactionScopeAsync(ct);
            return new UpdateMemberInstrumentResponseDto();
        }

        public async Task<DeleteMemberInstrumentResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var memberInstrument = await _repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberInstrumentNotFound);
            AuditHelper.SetDeleted(memberInstrument, _currentUser.UserId);
            using var scope = _uow.BeginTransactionScope();
            await _repo.DeleteAsync(id, memberInstrument, ct);
            await scope.CommitTransactionScopeAsync(ct);
            return new DeleteMemberInstrumentResponseDto();
        }

        private static MemberInstrumentResponseDto MapToDto(MemberInstrument mi) => new()
        {
            Id = mi.Id,
            MemberId = mi.MemberId,
            InstrumentId = mi.InstrumentId,
            Details = mi.Details
        };
    }
}
