using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IProductImageRepository : IRepository<ProductImage>
    {
        Task<IEnumerable<ProductImage>> GetByProductIdAsync(int productId, CancellationToken ct);
        Task<ProductImage?> GetPrimaryByProductIdAsync(int productId, CancellationToken ct);
    }
}