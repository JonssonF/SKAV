using Dapper;
using SKAV.Application.Interfaces;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;
using System.Data;
using System.Data.Common;

namespace SKAV.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
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

        public async Task CreateAsync(User user, CancellationToken ct)
        {
            using var conn = _connectionFactory.CreateConnection();
            conn.Open();
            await conn.ExecuteAsync(
                "INSERT INTO Users (Email, PasswordHash, Role) VALUES (@Email, @PasswordHash, @Role)",
                new { user.Email, user.PasswordHash, Role = (int)user.Role });
        }

        public Task<bool> EmailExistsAsync(string email, CancellationToken ct)
        {
            throw new NotImplementedException();
        }
    }
}
