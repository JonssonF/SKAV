using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SKAV.Application.Interfaces;
using SKAV.Application.Services;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validation.Gigs;
using SKAV.Application.Validator.Gigs;
using SKAV.Infrastructure.Database;
using SKAV.Infrastructure.Repositories;

namespace SKAV.Infrastructure.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services, IConfiguration configuration)
        {
            // Validate configuration
            var connectionString = configuration.GetConnectionString("Default") 
                ?? throw new InvalidOperationException("Connection string 'Default' not found.");
            
            // Services
            services.AddSingleton<IDbConnectionFactory, SqliteConnectionFactory>();
            services.AddTransient<DatabaseInitializer>();
            services.AddScoped<IGigService, GigService>();
            services.AddScoped<IGigValidator, GigValidator>();

            // Repositories
            services.AddScoped<IGigRepository, GigRepository>();

            // Options

            return services;
        }
    }
}
