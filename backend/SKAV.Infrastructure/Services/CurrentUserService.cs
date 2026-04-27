using Microsoft.AspNetCore.Http;
using SKAV.Application.Interfaces;
using SKAV.Domain.Enumeration;
using System.Security.Claims;

namespace SKAV.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? UserId
        {
            get
            {
                var id = _httpContextAccessor.HttpContext?
                    .User?
                    .FindFirst(ClaimTypes.NameIdentifier)?
                    .Value;

                return int.TryParse(id, out var userId) ? userId : null;
            }
        }

        public Roles Roles
        {
            get
            {
                var roles = _httpContextAccessor.HttpContext?
                    .User?
                    .FindAll(ClaimTypes.Role)
                    .Select(c => Enum.TryParse<Roles>(c.Value, out var role) ? role : Roles.None)
                    .Aggregate((a, b) => a | b);

                return roles ?? Roles.None;
            }
        }
    }
}
