using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public class SiteSettingRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow) : ISiteSettingRepository
    {
        public async Task CreateAsync(SiteSetting setting, CancellationToken ct)
        {
            var sql = """
        INSERT INTO SiteSettings (Key, Value, UpdatedAt, UpdatedBy)
        VALUES (@Key, @Value, @UpdatedAt, @UpdatedBy);
        """;

            await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: setting,
                transaction: uow.Transaction,
                cancellationToken: ct));
        }
        public async Task<IEnumerable<SiteSetting>> GetAllAsync(CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();
            return await conn.QueryAsync<SiteSetting>(new CommandDefinition(
                commandText: "SELECT * FROM SiteSettings;",
                cancellationToken: ct));
        }

        public async Task<SiteSetting?> GetByKeyAsync(string key, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();
            return await conn.QuerySingleOrDefaultAsync<SiteSetting>(new CommandDefinition(
                commandText: "SELECT * FROM SiteSettings WHERE Key = @Key LIMIT 1;",
                parameters: new { Key = key },
                cancellationToken: ct));
        }

        public async Task UpdateAsync(SiteSetting setting, CancellationToken ct)
        {
            var sql = """
                UPDATE SiteSettings
                SET Value = @Value, UpdatedAt = @UpdatedAt, UpdatedBy = @UpdatedBy
                WHERE Id = @Id;
                """;

            await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: setting,
                transaction: uow.Transaction,
                cancellationToken: ct));
        }
    }
}