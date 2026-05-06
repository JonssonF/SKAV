using System.Threading.RateLimiting;

namespace SKAV.Api.Extensions
{
    public static class RateLimitExtensions
    {
        public static IServiceCollection AddRateLimiting(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                options.AddPolicy("BookingLimit", context =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 2,
                            Window = TimeSpan.FromMinutes(15),
                            QueueLimit = 0,
                        }));

                options.RejectionStatusCode = 429;

                options.OnRejected = async (context, cancellationToken) =>
                {
                    context.HttpContext.Response.ContentType = "application/json";
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        errorCode = "TooManyRequests",
                        message = "För många förfrågningar. Försök igen om en stund."
                    }, cancellationToken);
                };
            });

            return services;
        }
    }
}