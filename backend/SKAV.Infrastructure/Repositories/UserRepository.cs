using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class UserRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<User>(db, uow), IUserRepository
    {
        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM Users
                WHERE Email = @Email AND DeletedAt IS NULL
                LIMIT 1;
                """;

            return await conn.QuerySingleOrDefaultAsync<User>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                cancellationToken: ct));
        }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT COUNT(1) FROM Users
                WHERE Email = @Email AND DeletedAt IS NULL;
                """;

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                cancellationToken: ct)) > 0;
        }

        public async Task<User?> GetByResetTokenAsync(string token, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();
            const string sql = """
        SELECT * FROM Users
        WHERE ResetToken = @Token AND DeletedAt IS NULL
        LIMIT 1;
        """;
            return await conn.QuerySingleOrDefaultAsync<User>(new CommandDefinition(
                commandText: sql,
                parameters: new { Token = token },
                cancellationToken: ct));
        }
    }
}