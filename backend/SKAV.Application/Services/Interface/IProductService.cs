using SKAV.Application.DTOs.Product;

namespace SKAV.Application.Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllAsync(CancellationToken ct);
        Task<ProductResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateProductResponseDto> CreateAsync(CreateProductRequestDto request, CancellationToken ct);
        Task<UpdateProductResponseDto> UpdateAsync(int id, UpdateProductRequestDto request, CancellationToken ct);
        Task<DeleteProductResponseDto> DeleteAsync(int id, CancellationToken ct);
        Task<IEnumerable<string>> GetCategoriesAsync(CancellationToken ct);
    }
}