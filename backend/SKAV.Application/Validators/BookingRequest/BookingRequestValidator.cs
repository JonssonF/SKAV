using SKAV.Domain.Exceptions;

namespace SKAV.Application.Validators.BookingRequest
{
    public class BookingRequestValidator
    {
        public static void ValidateDate(DateTimeOffset date)
        {
            var now = DateTimeOffset.UtcNow;

            if (date < now)
                throw new ValidationException("Date", "Datum kan inte vara i det förflutna.");

            if (date > now.AddYears(2))
                throw new ValidationException("Date", "Datum får max vara två år framåt.");
        }
    }
}
