using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SKAV.Application.Interfaces;
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

            // Automatically register services, repositories, and validators by convention
            var assembly = Assembly.GetExecutingAssembly();

            // Services
            RegisterByConvention(services, assembly, "Service");
            //services.AddScoped<IJwtService, JwtService>();
            // Repositories
            RegisterByConvention(services, assembly, "Repository");

            // Validators
            RegisterByConvention(services, assembly, "Validator");

            // Options
            services.AddSingleton<IDbConnectionFactory, SqliteConnectionFactory>();
            services.AddTransient<DatabaseInitializer>();
            services.AddScoped<JwtService>();
            services.AddScoped<SeedData>();
            services.AddScoped<IUnitOfWorkConnection, UnitOfWorkConnection>();

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
