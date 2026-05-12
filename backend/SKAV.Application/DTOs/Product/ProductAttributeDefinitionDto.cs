namespace SKAV.Application.DTOs.Product
{
    public class ProductAttributeDefinitionDto
    {
        public int Id { get; init; }
        public required string Name { get; init; }
        public required string Values { get; init; }
        public int DisplayOrder { get; init; }
    }
}