using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace SKAV.Api.Extensions
{
    public static class AuthExtensions
    {
        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services, IConfiguration configuration)
        {
            var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            return services;
        }
    }
}
