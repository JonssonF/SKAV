using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IProductAttributeDefinitionRepository : IRepository<ProductAttributeDefinition>
    {
        Task<IEnumerable<ProductAttributeDefinition>> GetByProductIdAsync(int productId, CancellationToken ct);
    }
}