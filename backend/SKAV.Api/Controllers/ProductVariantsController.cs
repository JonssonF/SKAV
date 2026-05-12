using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.ProductVariant;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/product-variants")]
    [ApiController]
    [Authorize(Roles = "Admin,Editor")]
    public class ProductVariantsController(IProductVariantService service) : ControllerBase
    {
        [HttpPost]
        [SwaggerOperation("Skapa en ny produktvariant")]
        public async Task<CreateProductVariantResponseDto> Create(CreateProductVariantRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [SwaggerOperation("Uppdatera en produktvariant")]
        public async Task<UpdateProductVariantResponseDto> Update(int id, UpdateProductVariantRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Ta bort en produktvariant")]
        public async Task<DeleteProductVariantResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}