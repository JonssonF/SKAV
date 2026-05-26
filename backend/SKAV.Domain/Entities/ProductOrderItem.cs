using SKAV.Domain.Attributes;
namespace SKAV.Domain.Entities
{
    [TableName("ProductOrderItems")]
    public class ProductOrderItem : BaseEntity
    {
        public int ProductOrderId { get; set; }
        public int ProductId { get; set; }
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public bool IsSigned { get; set; }
    }
}