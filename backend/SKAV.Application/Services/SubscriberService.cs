using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Subscriber;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class SubscriberService(
         ISubscriberRepository repo,
         IUnitOfWork uow) : ISubscriberService
    {
        public async Task<IEnumerable<SubscriberResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var subscribers = await repo.GetAllAsync(ct);
            return subscribers.Select(s => new SubscriberResponseDto
            {
                Email = s.Email,
            });
        }

        public async Task<SubscriberResponseDto> SubscribeAsync(SubscriberRequestDto request, CancellationToken ct)
        {
            var exists = await repo.EmailExistsAsync(request.Email, ct);
            if (exists)
                throw new BusinessRuleException(
                    "E-postadressen prenumererar redan.",
                    BusinessRules.EmailAlreadyExists);

            var subscriber = new Subscriber
            {
                Email = request.Email
            };

            AuditHelper.SetCreated(subscriber, null);

            using var scope = uow.BeginTransactionScope();
            await repo.CreateAsync(subscriber, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new SubscriberResponseDto
            {
                Email = subscriber.Email,
            };
        }

        public async Task<UnsubscribeResponseDto> UnsubscribeAsync(SubscriberRequestDto request, CancellationToken ct)
        {
            var subscriber = await repo.GetByEmailAsync(request.Email, ct)
                ?? throw new NotFoundException(BusinessRules.SubscriberNotFound);

            using var scope = uow.BeginTransactionScope();
            await repo.HardDeleteAsync(subscriber.Id, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UnsubscribeResponseDto();
        }
    }
}
