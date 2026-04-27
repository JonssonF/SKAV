using SKAV.Domain.Enumeration;

namespace SKAV.Application.Interfaces
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
        Roles Roles { get; }
    }
}
