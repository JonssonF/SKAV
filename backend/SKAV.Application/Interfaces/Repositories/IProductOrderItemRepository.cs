using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IProductOrderItemRepository : IRepository<ProductOrderItem>
    {
        Task<IEnumerable<ProductOrderItem>> GetByOrderIdAsync(int orderId, CancellationToken ct);
    }
}