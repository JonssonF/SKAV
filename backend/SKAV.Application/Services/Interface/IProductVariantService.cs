using SKAV.Application.DTOs.ProductVariant;

namespace SKAV.Application.Services.Interface
{
    public interface IProductVariantService
    {
        Task<CreateProductVariantResponseDto> CreateAsync(CreateProductVariantRequestDto request, CancellationToken ct);
        Task<UpdateProductVariantResponseDto> UpdateAsync(int id, UpdateProductVariantRequestDto request, CancellationToken ct);
        Task<DeleteProductVariantResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}