using SKAV.Application.DTOs.ProductImage;

namespace SKAV.Application.Services.Interface
{
    public interface IProductImageService
    {
        Task<CreateProductImageResponseDto> CreateAsync(CreateProductImageRequestDto request, CancellationToken ct);
        Task<UpdateProductImageResponseDto> UpdateAsync(int id, UpdateProductImageRequestDto request, CancellationToken ct);
        Task<DeleteProductImageResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}