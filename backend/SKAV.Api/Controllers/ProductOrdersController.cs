using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SKAV.Application.DTOs.ProductOrder;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/product-orders")]
    [ApiController]
    public class ProductOrdersController(IProductOrderService service) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Hämta alla beställningar")]
        public async Task<IEnumerable<ProductOrderResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Hämta en beställning")]
        public async Task<ProductOrderResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [AllowAnonymous]
        [EnableRateLimiting("BookingLimit")]
        [SwaggerOperation("Skicka en beställning")]
        public async Task<CreateProductOrderResponseDto> Create(CreateProductOrderRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}/handle")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Markera en beställning som hanterad")]
        public async Task<HandleProductOrderResponseDto> Handle(int id, CancellationToken ct)
            => await service.HandleAsync(id, ct);

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Avbryt en beställning och återställ lagersaldo")]
        public async Task<CancelProductOrderResponseDto> Cancel(int id, CancellationToken ct)
            => await service.CancelAsync(id, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Radera en beställning")]
        public async Task<DeleteProductOrderResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}