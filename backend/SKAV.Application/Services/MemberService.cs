using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Member;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validators.Members;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Enumeration;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class MemberService(
        IMemberRepository repo,
        IUnitOfWork uow,
        ICurrentUserService currentUser,
        IMemberValidator memberValidator) : IMemberService
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

        public async Task<CreateMemberResponseDto> CreateAsync(CreateMemberRequestDto request, CancellationToken ct)
        {
            var member = new Member
            {
                Name = request.Name,
                Quote = request.Quote,
                ImageUrl = request.ImageUrl,
                DisplayOrder = request.DisplayOrder,
            };
            
            await memberValidator.ValidateCreateAsync(request, ct);
            AuditHelper.SetCreated(member, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            var id = await repo.CreateAsync(member, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateMemberResponseDto { Id = id };
        }

        public async Task<UpdateMemberResponseDto> UpdateAsync(int id, UpdateMemberRequestDto request, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberNotFound);

            if (!currentUser.Roles.HasFlag(Roles.Admin) && 
                !currentUser.Roles.HasFlag(Roles.Editor) &&
                existing.UserId != currentUser.UserId)
            {
                throw new ForbiddenException(BusinessRules.Forbidden);
            }


            existing.Name = request.Name;
            existing.Quote = request.Quote;
            existing.ImageUrl = request.ImageUrl;
            existing.DisplayOrder = request.DisplayOrder;

            await memberValidator.ValidateUpdateAsync(id, request, ct);
            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateMemberResponseDto();
        }

        public async Task<DeleteMemberResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.MemberNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteMemberResponseDto();
        }

        private static MemberResponseDto MapToDto(Member m) => new()
        {
            Id = m.Id,
            Name = m.Name,
            Quote = m.Quote,
            ImageUrl = m.ImageUrl,
            DisplayOrder = m.DisplayOrder,
        };
    }
}
