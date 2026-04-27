using System.Text.Json;

namespace SKAV.Domain.Exceptions
{
    public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex) when (!ExceptionHelper.IsFatal(ex))
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);

            var (statusCode, errorCode, errors) = ex switch
            {
                NotFoundException e => (404, e.Message, null),
                UnauthorizedException e => (401, e.Message, null),
                BusinessRuleException e => (400, e.ErrorCode ?? e.Message, null),
                ValidationException e => (400, "ValidationFailed", e.Errors),
                _ => (500, "InternalServerError", null)
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                errorCode,
                message = ex.Message,
                errors
            }, new JsonSerializerOptions
            {
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });
        }
    }
}
