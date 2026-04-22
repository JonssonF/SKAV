using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SKAV.Application.Interfaces;
using SKAV.Application.Services;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validation.Gigs;
using SKAV.Application.Validator.Gigs;
using SKAV.Application.Validator.User;
using SKAV.Infrastructure.Database;
using SKAV.Infrastructure.Repositories;
using SKAV.Infrastructure.Services;

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
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddSingleton<IDbConnectionFactory, SqliteConnectionFactory>();
            services.AddScoped<IGigService, GigService>();
            services.AddScoped<IMemberService, MemberService>();
            services.AddScoped<IUserService, UserService>();

            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IGigRepository, GigRepository>();
            services.AddScoped<IMemberRepository, MemberRepository>();

            // Options
            services.AddTransient<DatabaseInitializer>();
            services.AddScoped<JwtService>();
            services.AddScoped<SeedData>();
            services.AddScoped<IUnitOfWorkConnection, UnitOfWorkConnection>();

            // Validators
            services.AddScoped<IGigValidator, GigValidator>();
            services.AddScoped<IUserValidator, UserValidator>();


            return services;
        }
    }
}
