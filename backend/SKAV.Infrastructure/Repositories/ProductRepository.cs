using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public class ProductRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow)
        : BaseRepository<Product>(db, uow), IProductRepository
    {
        public async Task<int> UpdateWithVersionCheckAsync(Product product, CancellationToken ct)
        {
            var sql = @"
                UPDATE Products 
                SET Title = @Title,
                    Description = @Description,
                    Price = @Price,
                    ImageUrl = @ImageUrl,
                    Category = @Category,
                    StockQuantity = @StockQuantity,
                    UpdatedAt = @UpdatedAt,
                    UpdatedBy = @UpdatedBy,
                    Version = Version + 1
                WHERE Id = @Id 
                    AND Version = @Version 
                    AND DeletedAt IS NULL;";

            return await Uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: product,
                transaction: Uow.Transaction,
                cancellationToken: ct));
        }
    }
}