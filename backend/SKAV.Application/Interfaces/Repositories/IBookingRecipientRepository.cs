using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IBookingRecipientRepository : IRepository<BookingNotificationRecipient>
    {
        Task<bool> ExistsByEmailAsync(string email, CancellationToken ct);
    }
}
