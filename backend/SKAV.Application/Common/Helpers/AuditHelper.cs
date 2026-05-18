using SKAV.Domain.Entities;

namespace SKAV.Application.Common.Helpers
{
    public static class AuditHelper
    {
        public static void SetCreated(BaseEntity entity, int? userId)
        {
            entity.CreatedAt = DateTimeOffset.UtcNow;
            entity.CreatedBy = userId;
        }

        public static void SetUpdated(BaseEntity entity, int? userId)
        {
            entity.UpdatedAt = DateTimeOffset.UtcNow;
            entity.UpdatedBy = userId;
        }

        public static void SetDeleted(BaseEntity entity, int? userId)
        {
            entity.DeletedAt = DateTimeOffset.UtcNow;
            entity.DeletedBy = userId;
        }
    }
}
