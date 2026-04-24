using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;
using SKAV.Infrastructure.Database.UoW;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class UserRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow) : IUserRepository
    {
        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT Id, Email, PasswordHash, Role
                FROM Users
                WHERE Email = @Email
                LIMIT 1;
                """;

            return await conn.QuerySingleOrDefaultAsync<User>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                cancellationToken: ct));
        }

        public async Task<User?> GetByIdAsync(int? id, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT Id, Email, PasswordHash, Role
                FROM Users
                WHERE Id = @Id
                LIMIT 1;
                """;

            return await conn.QuerySingleOrDefaultAsync<User>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                cancellationToken: ct));
        }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT COUNT(1)
                FROM Users
                WHERE Email = @Email;
                """;

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                cancellationToken: ct)) > 0;
        }

        public async Task CreateAsync(User user, CancellationToken ct)
        {
            const string sql = """
                INSERT INTO Users (Email, PasswordHash, Role)
                VALUES (@Email, @PasswordHash, @Role);
                """;

            await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { user.Email, user.PasswordHash, Role = (int)user.Role },
                transaction: uow.Transaction,
                cancellationToken: ct));
        }

        public async Task UpdateAsync(User user, CancellationToken ct)
        {
            const string sql = """
                UPDATE Users
                SET Email = @Email,
                    PasswordHash = @PasswordHash,
                    Role = @Role
                WHERE Id = @Id;
                """;

            var affected = await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { user.Email, user.PasswordHash, Role = (int)user.Role, user.Id },
                transaction: uow.Transaction,
                cancellationToken: ct));

            if (affected == 0)
                throw new KeyNotFoundException($"User with id {user.Id} not found.");
        }

        public async Task DeleteAsync(int id, CancellationToken ct)
        {
            const string sql = """
                DELETE FROM Users
                WHERE Id = @Id;
                """;

            var affected = await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                transaction: uow.Transaction,
                cancellationToken: ct));

            if (affected == 0)
                throw new KeyNotFoundException($"User with id {id} not found.");
        }
    }
}