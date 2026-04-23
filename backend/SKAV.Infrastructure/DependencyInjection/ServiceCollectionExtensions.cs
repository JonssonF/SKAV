using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using SKAV.Infrastructure.Database;
using SKAV.Infrastructure.Services;
using System.Reflection;

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

            // Assemblies to scan
            var assemblies = new[]
            {
            typeof(IAuthService).Assembly,              // Application
            typeof(SqliteConnectionFactory).Assembly    // Infrastructure
        };

            // Register by convention
            foreach (var assembly in assemblies)
            {
                RegisterByConvention(services, assembly, "Service");
                RegisterByConvention(services, assembly, "Repository");
                RegisterByConvention(services, assembly, "Validator");
            }

            // Explicit registrations
            services.AddScoped<IJwtService, JwtService>();
            services.AddSingleton<IDbConnectionFactory, SqliteConnectionFactory>();
            services.AddScoped<IUnitOfWorkConnection, UnitOfWorkConnection>();
            services.AddTransient<DatabaseInitializer>();
            services.AddScoped<SeedData>();

            return services;
        }
        private static void RegisterByConvention(IServiceCollection services, Assembly assembly, string suffix)
        {
            var types = assembly.GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract);

            foreach (var implementation in types)
            {
                var interfaceType = implementation.GetInterfaces()
                    .FirstOrDefault(i => i.Name == $"I{implementation.Name}");

                if (interfaceType != null && implementation.Name.EndsWith(suffix))
                {
                    services.AddScoped(interfaceType, implementation);
                }
            }
        }
    }
}
