using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Resend;
using SKAV.Application.Services.Interface;

namespace SKAV.Infrastructure.Services
{
    public class ResendEmailService : IEmailService
    {
        private readonly IResend _resend;
        private readonly string _fromEmail;
        private readonly string _fromName;
        private readonly ILogger<ResendEmailService> _logger;

        public ResendEmailService(
            IConfiguration configuration,
            ILogger<ResendEmailService> logger)
        {
            _logger = logger;

            var apiKey = configuration["Resend:ApiKey"]
                ?? throw new InvalidOperationException("Resend:ApiKey is not configured.");

            _fromEmail = configuration["Resend:FromEmail"]
                ?? throw new InvalidOperationException("Resend:FromEmail is not configured.");

            _fromName = configuration["Resend:FromName"] ?? "SKAV";

            _resend = ResendClient.Create(apiKey);
        }

        public async Task<bool> SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default)
        {
            try
            {
                await _resend.EmailSendAsync(new EmailMessage
                {
                    From = $"{_fromName} <{_fromEmail}>",
                    To = to,
                    Subject = subject,
                    HtmlBody = htmlBody,
                });

                _logger.LogDebug("Mail skickat till {To}", to);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Kunde inte skicka mail till {To}", to);
                return false;
            }
        }
    }
}
