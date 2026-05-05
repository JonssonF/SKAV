using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.DTOs.BookingRequest;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/booking-requests")]
    [ApiController]
    public class BookingRequestsController(IBookingRequestService service) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Hämta alla bokningsförfrågningar")]
        public async Task<IEnumerable<BookingRequestResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Hämta en bokningsförfrågan")]
        public async Task<BookingRequestResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [AllowAnonymous]
        [SwaggerOperation("Skicka en bokningsförfrågan")]
        public async Task<CreateBookingRequestResponseDto> Create(CreateBookingRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}/read")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Markera en bokningsförfrågan som läst")]
        public async Task<MarkBookingReadResponseDto> MarkAsRead(int id, CancellationToken ct)
            => await service.MarkAsReadAsync(id, ct);
    }
}