using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public class ProductOrderItemRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow)
        : BaseRepository<ProductOrderItem>(db, uow), IProductOrderItemRepository
    {
        public async Task<IEnumerable<ProductOrderItem>> GetByOrderIdAsync(int orderId, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();
            var sql = "SELECT * FROM ProductOrderItems WHERE ProductOrderId = @OrderId AND DeletedAt IS NULL;";
            return await conn.QueryAsync<ProductOrderItem>(new CommandDefinition(
                commandText: sql,
                parameters: new { OrderId = orderId },
                cancellationToken: ct));
        }
    }
}