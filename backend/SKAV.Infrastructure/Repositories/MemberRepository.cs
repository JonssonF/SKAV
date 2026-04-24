using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class MemberRepository(IUnitOfWorkConnection uow, IDbConnectionFactory db) : IMemberRepository
    {
        public async Task<IEnumerable<Member>> GetAllAsync(CancellationToken ct)
        {
            const string sql = """
                SELECT * FROM Members
                WHERE DeletedAt IS NULL
                ORDER BY DisplayOrder ASC;
                """;

            using var conn = db.CreateConnection();
            conn.Open();

            return await conn.QueryAsync<Member>(new CommandDefinition(
                commandText: sql,
                cancellationToken: ct));
        }

        public async Task<Member?> GetByIdAsync(int id, CancellationToken ct)
        {
            const string sql = """
                SELECT * FROM Members
                WHERE Id = @Id
                AND DeletedAt IS NULL
                LIMIT 1;
                """;

            using var conn = db.CreateConnection();
            conn.Open();

            return await conn.QuerySingleOrDefaultAsync<Member>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                cancellationToken: ct));
        }

        public async Task<int> CreateAsync(Member member, CancellationToken ct)
        {
            const string sql = """
                INSERT INTO Members (Name, Role, Quote, ImageUrl, DisplayOrder, CreatedAt, CreatedBy)
                VALUES (@Name, @Role, @Quote, @ImageUrl, @DisplayOrder, @CreatedAt, @CreatedBy);
                SELECT last_insert_rowid();
                """;

            return (int)await uow.Connection.ExecuteScalarAsync<long>(new CommandDefinition(
                commandText: sql,
                parameters: new
                {
                    member.Name,
                    member.Role,
                    member.Quote,
                    member.ImageUrl,
                    member.DisplayOrder,
                    member.CreatedAt,
                    member.CreatedBy
                },
                transaction: uow.Transaction,
                cancellationToken: ct));
        }

        public async Task UpdateAsync(Member member, CancellationToken ct)
        {
            const string sql = """
                UPDATE Members
                SET Name = @Name,
                    Role = @Role,
                    Quote = @Quote,
                    ImageUrl = @ImageUrl,
                    DisplayOrder = @DisplayOrder,
                    UpdatedAt = @UpdatedAt,
                    UpdatedBy = @UpdatedBy
                WHERE Id = @Id AND DeletedAt IS NULL;
                """;

            var affected = await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new
                {
                    member.Name,
                    member.Role,
                    member.Quote,
                    member.ImageUrl,
                    member.DisplayOrder,
                    member.UpdatedAt,
                    member.UpdatedBy,
                    member.Id
                },
                transaction: uow.Transaction,
                cancellationToken: ct));

            if (affected == 0)
                throw new KeyNotFoundException($"Member with id {member.Id} not found.");
        }

        public async Task DeleteAsync(int id, Member member, CancellationToken ct)
        {
            const string sql = """
                UPDATE Members
                SET DeletedAt = @DeletedAt,
                    DeletedBy = @DeletedBy
                WHERE Id = @Id AND DeletedAt IS NULL;
                """;

            var affected = await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id, member.DeletedAt, member.DeletedBy },
                transaction: uow.Transaction,
                cancellationToken: ct));

            if (affected == 0)
                throw new KeyNotFoundException($"Member with id {id} not found.");
        }
    }
}