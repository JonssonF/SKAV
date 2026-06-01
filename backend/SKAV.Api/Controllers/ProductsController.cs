using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.Product;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController(IProductService service) : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        [SwaggerOperation("Hämta alla produkter")]
        public async Task<IEnumerable<ProductResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [AllowAnonymous]
        [SwaggerOperation("Hämta en produkt med attribut och varianter")]
        public async Task<ProductResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Skapa en ny produkt")]
        public async Task<CreateProductResponseDto> Create(CreateProductRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Uppdatera en produkt")]
        public async Task<UpdateProductResponseDto> Update(int id, UpdateProductRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Ta bort en produkt")]
        public async Task<DeleteProductResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);

        [HttpGet("categories")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Hämta alla unika kategorier")]
        public async Task<IEnumerable<string>> GetCategories(CancellationToken ct)
        => await service.GetCategoriesAsync(ct);
    }
}