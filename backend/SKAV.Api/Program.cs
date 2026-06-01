using SKAV.Api.Extensions;
using SKAV.Domain.Exceptions;
using SKAV.Infrastructure.Database;
using SKAV.Infrastructure.DependencyInjection;

namespace SKAV.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddJwtAuthentication(builder.Configuration);
            builder.Services.AddInfrastructure(builder.Configuration);
            builder.Services.AddRateLimiting();
            builder.Services.AddControllers();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddCorsPolicy();
            builder.Services.AddSwaggerWithJwt();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var dbInitializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
                await dbInitializer.InitializeAsync();

                var seeder = scope.ServiceProvider.GetRequiredService<SeedData>();
                await seeder.SeedAsync();
            }

            if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Test"))
            {
               app.UseSwagger();
               app.UseSwaggerUI();
            }

                app.UseMiddleware<ExceptionHandlingMiddleware>();
                app.UseCors("AllowFrontend");
                app.UseStaticFiles();
                // Only use HTTPS redirection in production, as it can interfere with development and testing
                if (!app.Environment.IsDevelopment())
                {
                    app.UseHttpsRedirection();
                }
                app.UseRateLimiter();
                app.UseAuthentication();
                app.UseAuthorization();
                app.MapControllers();
                app.Run();
        }
    }
}
