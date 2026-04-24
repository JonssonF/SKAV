using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class GigRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<Gig>(db, uow), IGigRepository
    {
        public async Task<bool> ExistsByTitleAndDateAsync(
            string title, DateTimeOffset date, int? excludeId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT COUNT(1) FROM Gigs
                WHERE Title = @Title
                AND Date = @Date
                AND DeletedAt IS NULL
                AND (@ExcludeId IS NULL OR Id != @ExcludeId);
                """;

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Title = title, Date = date.ToUniversalTime().ToString("O"), ExcludeId = excludeId },
                cancellationToken: ct)) > 0;
        }
    }
}