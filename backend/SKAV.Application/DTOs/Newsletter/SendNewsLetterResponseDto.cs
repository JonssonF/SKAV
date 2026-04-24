namespace SKAV.Application.DTOs.Newsletter
{
    public class SendNewsletterResponseDto
    {
        public int TotalSubscribers { get; init; }
        public int Sent { get; init; }
        public int Failed { get; init; }
    }
}
