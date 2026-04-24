using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class SubscriberRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<Subscriber>(db, uow), ISubscriberRepository
    {
        public async Task<bool> EmailExistsAsync(string email, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT COUNT(1) FROM Subscribers
                WHERE Email = @Email AND DeletedAt IS NULL;
                """;

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                cancellationToken: ct)) > 0;
        }

        public async Task<Subscriber?> GetByEmailAsync(string email, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM Subscribers
                WHERE Email = @Email AND DeletedAt IS NULL
                LIMIT 1;
                """;

            return await conn.QuerySingleOrDefaultAsync<Subscriber>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                cancellationToken: ct));
        }
    }
}
