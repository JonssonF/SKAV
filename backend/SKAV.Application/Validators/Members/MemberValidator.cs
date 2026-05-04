using SKAV.Application.DTOs.Member;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Domain.Consts;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.Members
{
    public class MemberValidator(IMemberRepository memberRepository) : IMemberValidator
    {
        public async Task ValidateCreateAsync(CreateMemberRequestDto request, CancellationToken ct)
        {
            await ValidateDisplayOrderDuplicate(request.DisplayOrder, null, ct);
        }

        public async Task ValidateUpdateAsync(int id, UpdateMemberRequestDto request, CancellationToken ct)
        {
            await ValidateDisplayOrderDuplicate(request.DisplayOrder, id, ct);
        }

        private async Task ValidateDisplayOrderDuplicate(int displayOrder, int? excludeId, CancellationToken ct)
        {
            var exists = await memberRepository.ExistsByDisplayOrderAsync(displayOrder, excludeId, ct);
            if (exists)
                throw new BusinessRuleException(
                    "Det finns redan en medlem med samma visningsordning.",
                    BusinessRules.MemberDisplayOrderExists);
        }
    }
}
