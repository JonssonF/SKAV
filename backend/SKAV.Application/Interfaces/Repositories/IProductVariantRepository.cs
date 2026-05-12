using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IProductVariantRepository : IRepository<ProductVariant>
    {
        Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId, CancellationToken ct);
        Task<int> UpdateWithVersionCheckAsync(ProductVariant variant, CancellationToken ct);
    }
}