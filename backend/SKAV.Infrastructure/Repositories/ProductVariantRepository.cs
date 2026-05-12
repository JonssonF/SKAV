using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public class ProductVariantRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow)
        : BaseRepository<ProductVariant>(db, uow), IProductVariantRepository
    {
        public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();
            var sql = "SELECT * FROM ProductVariants WHERE ProductId = @ProductId AND DeletedAt IS NULL;";
            return await conn.QueryAsync<ProductVariant>(new CommandDefinition(
                commandText: sql,
                parameters: new { ProductId = productId },
                cancellationToken: ct));
        }

        public async Task<int> UpdateWithVersionCheckAsync(ProductVariant variant, CancellationToken ct)
        {
            var sql = @"
                UPDATE ProductVariants 
                SET Attributes = @Attributes,
                    PriceOverride = @PriceOverride,
                    StockQuantity = @StockQuantity,
                    UpdatedAt = @UpdatedAt,
                    UpdatedBy = @UpdatedBy,
                    Version = Version + 1
                WHERE Id = @Id 
                    AND Version = @Version 
                    AND DeletedAt IS NULL;";

            return await Uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: variant,
                transaction: Uow.Transaction,
                cancellationToken: ct));
        }
    }
}