using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IProductOrderRecipientRepository : IRepository<ProductOrderNotificationRecipient>
    {
        Task<bool> ExistsByEmailAsync(string email, CancellationToken ct);
    }
}