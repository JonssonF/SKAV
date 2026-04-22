using SKAV.Domain.Entities;

namespace SKAV.Application.Common.Helpers
{
    public static class AuditHelper
    {
        public static void SetCreated(BaseEntity entity, int? userId)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = userId;
        }

        public static void SetUpdated(BaseEntity entity, int? userId)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = userId;
        }

        public static void SetDeleted(BaseEntity entity, int? userId)
        {
            entity.DeletedAt = DateTime.UtcNow;
            entity.DeletedBy = userId;
        }
    }
}
