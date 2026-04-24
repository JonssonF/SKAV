using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class SongRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<Song>(db, uow), ISongRepository
    {
        public async Task<IEnumerable<Song>> GetByAlbumIdAsync(int albumId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM Songs
                WHERE AlbumId = @AlbumId AND DeletedAt IS NULL
                ORDER BY TrackNumber ASC;
                """;

            return await conn.QueryAsync<Song>(new CommandDefinition(
                commandText: sql,
                parameters: new { AlbumId = albumId },
                cancellationToken: ct));
        }
    }
}
