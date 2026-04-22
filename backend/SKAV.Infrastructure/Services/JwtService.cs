using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SKAV.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SKAV.Infrastructure.Services
{
    public class JwtService
    {
        private readonly string _key;
        private readonly int _expiryHours;

        public JwtService(IConfiguration config)
        {
            _key = config["Jwt:Key"]!;
            _expiryHours = int.Parse(config["Jwt:ExpiryHours"]!);
        }

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

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