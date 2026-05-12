using SKAV.Application.DTOs.ProductAttributeDefinition;

namespace SKAV.Application.Services.Interface
{
    public interface IProductAttributeDefinitionService
    {
        Task<CreateProductAttributeDefinitionResponseDto> CreateAsync(CreateProductAttributeDefinitionRequestDto request, CancellationToken ct);
        Task<DeleteProductAttributeDefinitionResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}