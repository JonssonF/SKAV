using Dapper;
using SKAV.Application.Interfaces;
using SKAV.Domain.Models;
using SKAV.Infrastructure.Database;
using System.Data;
using System.Data.Common;

namespace SKAV.Infrastructure.Repositories
{
    public class MemberRepository : IMemberRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public MemberRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        private async Task<IDbConnection> OpenAsync(CancellationToken ct)
        {
            var conn = _connectionFactory.CreateConnection();

            if (conn is DbConnection dbConn)
                await dbConn.OpenAsync(ct);
            else
                conn.Open();

            return conn;
        }

        public async Task<IEnumerable<Member>> GetAllAsync(CancellationToken ct)
        {
            const string sql = """
            SELECT * FROM Members
            ORDER BY DisplayOrder ASC;
        """;

            using var connection = await OpenAsync(ct);
            return await connection.QueryAsync<Member>(sql);
        }

        public async Task<Member?> GetByIdAsync(int id, CancellationToken ct)
        {
            const string sql = """
            SELECT * FROM Members
            WHERE Id = @Id
            LIMIT 1;
        """;

            using var connection = await OpenAsync(ct);
            return await connection.QuerySingleOrDefaultAsync<Member>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Member member, CancellationToken ct)
        {
            const string sql = """
            INSERT INTO Members (Name, Role, Quote, ImageUrl, DisplayOrder)
            VALUES (@Name, @Role, @Quote, @ImageUrl, @DisplayOrder);

            SELECT last_insert_rowid();
        """;

            using var connection = await OpenAsync(ct);
            return await connection.ExecuteScalarAsync<int>(sql, member);
        }

        public async Task UpdateAsync(Member member, CancellationToken ct)
        {
            const string sql = """
            UPDATE Members
            SET Name = @Name,
                Role = @Role,
                Quote = @Quote,
                ImageUrl = @ImageUrl,
                DisplayOrder = @DisplayOrder
            WHERE Id = @Id;
        """;

            using var connection = await OpenAsync(ct);
            await connection.ExecuteAsync(sql, member);
        }

        public async Task DeleteAsync(int id, CancellationToken ct)
        {
            const string sql = "DELETE FROM Members WHERE Id = @Id;";

            using var connection = await OpenAsync(ct);
            await connection.ExecuteAsync(sql, new { Id = id });
        }
    }
}
