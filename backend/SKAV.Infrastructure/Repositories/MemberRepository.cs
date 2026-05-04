using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class MemberRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<Member>(db, uow), IMemberRepository
    {
        public async Task<bool> ExistsByDisplayOrderAsync(int displayOrder, int? excludeId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            var sql = "" +
                "SELECT COUNT(1) " +
                "FROM Members " +
                "WHERE DisplayOrder = @DisplayOrder " +
                "AND DeletedAt IS NULL" +
                      (excludeId.HasValue ? " AND Id != @ExcludeId" : "") + ";";

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { DisplayOrder = displayOrder, ExcludeId = excludeId },
                cancellationToken: ct)) > 0;
        }
    }
}