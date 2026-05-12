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
    }
}