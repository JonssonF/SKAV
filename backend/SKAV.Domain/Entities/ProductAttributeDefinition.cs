using SKAV.Domain.Attributes;

namespace SKAV.Domain.Entities
{
    [TableName("ProductAttributeDefinitions")]
    public class ProductAttributeDefinition : BaseEntity
    {
        public int ProductId { get; set; }
        public required string Name { get; set; }
        public required string AttributeValues { get; set; }
        public int DisplayOrder { get; set; }
    }
}