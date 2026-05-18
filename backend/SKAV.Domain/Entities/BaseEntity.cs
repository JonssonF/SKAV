namespace SKAV.Domain.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public int? CreatedBy { get; set; }

        public DateTimeOffset? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }
        public int? DeletedBy { get; set; }
    }
}
