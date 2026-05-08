using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.BookingNotificationRecipient;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/booking-recipients")]
    [ApiController]
    [Authorize]
    public class BookingRecipientsController(IBookingRecipientService service) : ControllerBase
    {
        [HttpGet]
        [SwaggerOperation("Hämta alla mottagare av bokningsnotiser")]
        public async Task<IEnumerable<BookingRecipientResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpPost]
        [SwaggerOperation("Lägg till en mottagare av bokningsnotiser")]
        public async Task<CreateBookingRecipientResponseDto> Create(CreateBookingRecipientRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpDelete("{id}")]
        [SwaggerOperation("Ta bort en mottagare av bokningsnotiser")]
        public async Task<DeleteBookingRecipientResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);
    }
}