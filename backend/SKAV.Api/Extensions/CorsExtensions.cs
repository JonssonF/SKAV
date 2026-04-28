namespace SKAV.Api.Extensions
{
    // This class defines an extension method for IServiceCollection to add a CORS policy that allows requests from the frontend application running on http://localhost:5173.
    // The policy allows any header and any method, which is useful during development to enable communication between the frontend and backend without CORS issues.
    // In a production environment, you would typically want to restrict the allowed origins and possibly the allowed headers and methods for better security.
    public static class CorsExtensions
    {
        public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            return services;
        }
    }
}