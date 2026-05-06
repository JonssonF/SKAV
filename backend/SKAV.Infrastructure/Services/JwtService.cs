using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Entities;
using SKAV.Domain.Enumeration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SKAV.Infrastructure.Services
{
    public class JwtService(IConfiguration config) : IJwtService
    {
        private readonly string _key = config["Jwt:Key"]!;
        private readonly int _expiryHours = int.Parse(config["Jwt:ExpiryHours"]!);

        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };

            foreach (var role in Enum.GetValues<Roles>())
            {
                if (role != Roles.None && user.Roles.HasFlag(role))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(_expiryHours),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}