using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class LyricsRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<Lyrics>(db, uow), ILyricsRepository
    {
        public async Task<Lyrics?> GetBySongIdAsync(int songId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM Lyrics
                WHERE SongId = @SongId AND DeletedAt IS NULL
                LIMIT 1;
                """;

            return await conn.QuerySingleOrDefaultAsync<Lyrics>(new CommandDefinition(
                commandText: sql,
                parameters: new { SongId = songId },
                cancellationToken: ct));
        }

        public async Task<Lyrics?> GetBySlugAsync(string slug, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM Lyrics
                WHERE Slug = @Slug AND DeletedAt IS NULL
                LIMIT 1;
                """;

            return await conn.QuerySingleOrDefaultAsync<Lyrics>(new CommandDefinition(
                commandText: sql,
                parameters: new { Slug = slug },
                cancellationToken: ct));
        }
    }
}
