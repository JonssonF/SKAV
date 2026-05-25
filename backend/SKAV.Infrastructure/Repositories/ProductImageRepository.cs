using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class ProductImageRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow)
        : BaseRepository<ProductImage>(db, uow), IProductImageRepository
    {
        public async Task<IEnumerable<ProductImage>> GetByProductIdAsync(
            int productId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM ProductImages
                WHERE ProductId = @ProductId AND DeletedAt IS NULL
                ORDER BY DisplayOrder ASC;
                """;

            return await conn.QueryAsync<ProductImage>(new CommandDefinition(
                commandText: sql,
                parameters: new { ProductId = productId },
                cancellationToken: ct));
        }

        public async Task<ProductImage?> GetPrimaryByProductIdAsync(
            int productId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM ProductImages
                WHERE ProductId = @ProductId AND IsPrimary = 1 AND DeletedAt IS NULL
                LIMIT 1;
                """;

            return await conn.QueryFirstOrDefaultAsync<ProductImage>(new CommandDefinition(
                commandText: sql,
                parameters: new { ProductId = productId },
                cancellationToken: ct));
        }
    }
}