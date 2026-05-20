using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SKAV.Application.DTOs.SongProposal;
using SKAV.Application.Services.Interface;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/song-proposals")]
    [ApiController]
    public class SongProposalsController(ISongProposalService service) : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        [SwaggerOperation("Hämta alla låtförslag")]
        public async Task<IEnumerable<SongProposalResponseDto>> GetAll(CancellationToken ct)
            => await service.GetAllAsync(ct);

        [HttpGet("{id}")]
        [AllowAnonymous]
        [SwaggerOperation("Hämta ett låtförslag")]
        public async Task<SongProposalResponseDto> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct);

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Skapa ett låtförslag")]
        public async Task<CreateSongProposalResponseDto> Create(
            CreateSongProposalRequestDto request, CancellationToken ct)
            => await service.CreateAsync(request, ct);

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Uppdatera ett låtförslag")]
        public async Task<UpdateSongProposalResponseDto> Update(
            int id, UpdateSongProposalRequestDto request, CancellationToken ct)
            => await service.UpdateAsync(id, request, ct);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Ta bort ett låtförslag")]
        public async Task<DeleteSongProposalResponseDto> Delete(int id, CancellationToken ct)
            => await service.DeleteAsync(id, ct);

        [HttpPost("{id}/vote")]
        [AllowAnonymous]
        [EnableRateLimiting("BookingLimit")]
        [SwaggerOperation("Rösta på ett låtförslag")]
        public async Task<VoteSongProposalResponseDto> Vote(int id, CancellationToken ct)
            => await service.VoteAsync(id, GetVoterIp(), ct);

        [HttpPut("{id}/winner")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Markera ett låtförslag som vinnare")]
        public async Task<SetWinnerResponseDto> SetWinner(int id, CancellationToken ct)
            => await service.SetWinnerAsync(id, ct);

        [HttpPost("reset-votes")]
        [Authorize(Roles = "Admin,Editor")]
        [SwaggerOperation("Nollställ alla röster och skapa snapshots")]
        public async Task<ResetVotesResponseDto> ResetVotes(CancellationToken ct)
            => await service.ResetVotesAsync(ct);

        private string GetVoterIp()
            => HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}