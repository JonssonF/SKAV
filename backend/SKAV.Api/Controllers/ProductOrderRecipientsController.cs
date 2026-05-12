using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.ProductOrderNotificationRecipient;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/product-order-recipients")]
    [ApiController]
    [Authorize(Roles = "Admin,Editor")]
    public class ProductOrderRecipientsController(IProductOrderRecipientService service) : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation("Hämta alla mottagare av beställningsnotiser")]
        public async Task<IEnumerable<ProductOrderRecipientResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpPost]
        [SwaggerOperation("Lägg till en mottagare av beställningsnotiser")]
        public async Task<CreateProductOrderRecipientResponseDto> Create(CreateProductOrderRecipientRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Ta bort en mottagare av beställningsnotiser")]
        public async Task<DeleteProductOrderRecipientResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}