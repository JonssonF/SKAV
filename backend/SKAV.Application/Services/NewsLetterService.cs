using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.Newsletter;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class NewsletterService(
        ISubscriberRepository subscriberRepo,
        IEmailService emailService,
        IConfiguration configuration,
        ILogger<NewsletterService> logger) : INewsletterService
    {
        public async Task<SendNewsletterResponseDto> SendAsync(SendNewsletterRequestDto request, CancellationToken ct)
        {
            var subscribers = (await subscriberRepo.GetAllAsync(ct)).ToList();
            if (subscribers.Count == 0)
                throw new BusinessRuleException(
                    "Det finns inga prenumeranter att skicka till.",
                    BusinessRules.NoSubscribers);

            var siteUrl = configuration["Site:BaseUrl"] ?? "https://skav.nu";

            var sent = 0;
            var failed = 0;

            foreach (var subscriber in subscribers)
            {
                try
                {
                    var unsubscribeUrl = $"{siteUrl}/unsubscribe?email={Uri.EscapeDataString(subscriber.Email)}";
                    var html = NewsletterTemplate.Build(request.Subject, request.Body, unsubscribeUrl);

                    var success = await emailService.SendAsync(
                        subscriber.Email,
                        request.Subject,
                        html,
                        ct);

                    if (success) sent++;
                    else failed++;
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Kunde inte skicka nyhetsbrev till {Email}", subscriber.Email);
                    failed++;
                }
            }

            logger.LogInformation(
                "Nyhetsbrev skickat. Totalt: {Total}, Skickade: {Sent}, Misslyckade: {Failed}",
                subscribers.Count, sent, failed);

            return new SendNewsletterResponseDto
            {
                TotalSubscribers = subscribers.Count,
                Sent = sent,
                Failed = failed,
            };
        }
    }
}