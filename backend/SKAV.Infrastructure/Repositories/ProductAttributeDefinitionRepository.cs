using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public class ProductAttributeDefinitionRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow)
        : BaseRepository<ProductAttributeDefinition>(db, uow), IProductAttributeDefinitionRepository
    {
        public async Task<IEnumerable<ProductAttributeDefinition>> GetByProductIdAsync(int productId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();
            var sql = "SELECT * FROM ProductAttributeDefinitions WHERE ProductId = @ProductId AND DeletedAt IS NULL ORDER BY DisplayOrder;";
            return await conn.QueryAsync<ProductAttributeDefinition>(new CommandDefinition(
                commandText: sql,
                parameters: new { ProductId = productId },
                cancellationToken: ct));
        }
    }
}