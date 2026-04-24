using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class AlbumRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<Album>(db, uow), IAlbumRepository
    {
        public async Task<bool> ExistsByTitleAsync(
            string title, int? excludeId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
            SELECT COUNT(1) FROM Albums
            WHERE Title = @Title
            AND DeletedAt IS NULL
            AND (@ExcludeId IS NULL OR Id != @ExcludeId);
            """;

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Title = title, ExcludeId = excludeId },
                cancellationToken: ct)) > 0;
        }
    }
}
