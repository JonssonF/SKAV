using SKAV.Domain.Attributes;
namespace SKAV.Domain.Entities
{
    [TableName("ProductImages")]
    public class ProductImage : BaseEntity
    {
        public int ProductId { get; set; }
        public required string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }
}