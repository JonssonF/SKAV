using Dapper;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;
using System.Data;
using System.Data.Common;

namespace SKAV.Infrastructure.Repositories
{
    public class UserRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public UserRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct)
        {
            using var conn = _connectionFactory.CreateConnection();
            conn.Open();

            return await conn.QuerySingleOrDefaultAsync<User>(
                "SELECT Id, Email, PasswordHash, Role FROM Users WHERE Email = @Email",
                new { Email = email });
        }

    }
}
