namespace SKAV.Application.Services.Interface
{
    public interface IEmailService
    {
        /// <summary>
        /// Skickar ett e-postmeddelande till en mottagare.
        /// </summary>
        /// <param name="to">Mottagarens e-postadress.</param>
        /// <param name="subject">Ämnesrad.</param>
        /// <param name="htmlBody">HTML-innehåll.</param>
        /// <param name="ct">CancellationToken.</param>
        /// <returns>True om mailet skickades, false vid fel.</returns>
        Task<bool> SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default);
    }
}
