using SKAV.Application.DTOs.ProductOrder;

namespace SKAV.Application.Services.Interface
{
    public interface IProductOrderService
    {
        Task<IEnumerable<ProductOrderResponseDto>> GetAllAsync(CancellationToken ct);
        Task<ProductOrderResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateProductOrderResponseDto> CreateAsync(CreateProductOrderRequestDto request, CancellationToken ct);
        Task<HandleProductOrderResponseDto> HandleAsync(int id, CancellationToken ct);
        Task<CancelProductOrderResponseDto> CancelAsync(int id, CancellationToken ct);
        Task<DeleteProductOrderResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}