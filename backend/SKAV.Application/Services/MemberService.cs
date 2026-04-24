using SKAV.Application.Common;
using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Member;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator;
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
    public class MemberService(
        IMemberRepository repo,
        IUnitOfWork uow,
        ICurrentUserService currentUser) : IMemberService
    {
        public async Task<IEnumerable<MemberResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var members = await repo.GetAllAsync(ct);
            return members
                .OrderBy(m => m.DisplayOrder)
                .Select(MapToDto);
        }

        public async Task<MemberResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var member = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberNotFound);

            return MapToDto(member);
        }

        public async Task<int> CreateAsync(CreateMemberRequestDto request, CancellationToken ct)
        {
            var member = new Member
            {
                Name = request.Name,
                Role = request.Role,
                Quote = request.Quote,
                ImageUrl = request.ImageUrl,
                DisplayOrder = request.DisplayOrder
            };

            AuditHelper.SetCreated(member, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(member, ct);
            await scope.CommitTransactionScopeAsync(ct);
            return id;
        }

        public async Task UpdateAsync(int id, CreateMemberRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberNotFound);

            existing.Name = request.Name;
            existing.Role = request.Role;
            existing.Quote = request.Quote;
            existing.ImageUrl = request.ImageUrl;
            existing.DisplayOrder = request.DisplayOrder;

            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);
        }

        public async Task DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);
        }

        private static MemberResponseDto MapToDto(Member m) => new()
        {
            Id = m.Id,
            Name = m.Name,
            Role = m.Role,
            Quote = m.Quote,
            ImageUrl = m.ImageUrl,
            DisplayOrder = m.DisplayOrder
        };
    }
}
