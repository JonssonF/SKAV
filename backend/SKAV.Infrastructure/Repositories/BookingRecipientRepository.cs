using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public class BookingRecipientRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow)
        : BaseRepository<BookingNotificationRecipient>(db, uow), IBookingRecipientRepository
    {
        public async Task<bool> ExistsByEmailAsync(string email, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();
            var sql = "SELECT COUNT(1) FROM BookingNotificationRecipients WHERE Email = @Email AND DeletedAt IS NULL;";
            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                cancellationToken: ct)) > 0;
        }
    }
}