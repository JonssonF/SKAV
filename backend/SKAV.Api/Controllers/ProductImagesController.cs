using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.ProductImage;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/product-images")]
    [ApiController]
    public class ProductImagesController(IProductImageService service) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Lägg till en produktbild")]
        public async Task<CreateProductImageResponseDto> Create(
            CreateProductImageRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Uppdatera en produktbild")]
        public async Task<UpdateProductImageResponseDto> Update(
            int id, UpdateProductImageRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Ta bort en produktbild")]
        public async Task<DeleteProductImageResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}