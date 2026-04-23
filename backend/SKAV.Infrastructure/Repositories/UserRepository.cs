using Dapper;
using SKAV.Application.Interfaces;
using SKAV.Domain.Entities;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class UserRepository(IUnitOfWorkConnection connection) : IUserRepository
    {
        private readonly IUnitOfWorkConnection _connection = connection;

        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct)
        {
            using var connection = _connection.Connection;

            const string sql = """
                SELECT Id, Email, PasswordHash, Role
                FROM Users
                WHERE Email = @Email
                LIMIT 1;
                """;

            return await connection.QuerySingleOrDefaultAsync<User>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                transaction: _connection.Transaction,
                cancellationToken: ct));
        }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken ct)
        {
            const string sql = """
                SELECT COUNT(1)
                FROM Users
                WHERE Email = @Email;
                """;

            var count = await _connection.Connection.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Email = email },
                transaction: _connection.Transaction,
                cancellationToken: ct));

            return count > 0;
        }

        public async Task CreateAsync(User user, CancellationToken ct)
        {
            const string sql = """
                INSERT INTO Users (Email, PasswordHash, Role)
                VALUES (@Email, @PasswordHash, @Role);
                """;

            await _connection.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { user.Email, user.PasswordHash, Role = (int)user.Role },
                transaction: _connection.Transaction,
                cancellationToken: ct));
        }
    }
}
