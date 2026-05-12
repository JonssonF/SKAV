using SKAV.Application.DTOs.ProductOrderNotificationRecipient;

namespace SKAV.Application.Services.Interface
{
    public interface IProductOrderRecipientService
    {
        Task<IEnumerable<ProductOrderRecipientResponseDto>> GetAllAsync(CancellationToken ct);
        Task<CreateProductOrderRecipientResponseDto> CreateAsync(CreateProductOrderRecipientRequestDto request, CancellationToken ct);
        Task<DeleteProductOrderRecipientResponseDto> DeleteAsync(int id, CancellationToken ct);
    }
}