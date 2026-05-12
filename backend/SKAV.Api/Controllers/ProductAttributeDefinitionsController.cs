using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.ProductAttributeDefinition;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/product-attribute-definitions")]
    [ApiController]
    [Authorize(Roles = "Admin,Editor")]
    public class ProductAttributeDefinitionsController(IProductAttributeDefinitionService service) : ControllerBase
    {
        [HttpPost]
        [SwaggerOperation("Skapa en attributdefinition för en produkt")]
        public async Task<CreateProductAttributeDefinitionResponseDto> Create(CreateProductAttributeDefinitionRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Ta bort en attributdefinition")]
        public async Task<DeleteProductAttributeDefinitionResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}