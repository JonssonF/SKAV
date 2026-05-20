using SKAV.Application.DTOs.SongProposal;

namespace SKAV.Application.Services.Interface
{
    public interface ISongProposalService
    {
        Task<IEnumerable<SongProposalResponseDto>> GetAllAsync(CancellationToken ct);
        Task<SongProposalResponseDto> GetByIdAsync(int id, CancellationToken ct);
        Task<CreateSongProposalResponseDto> CreateAsync(CreateSongProposalRequestDto dto, CancellationToken ct);
        Task<UpdateSongProposalResponseDto> UpdateAsync(int id, UpdateSongProposalRequestDto dto, CancellationToken ct);
        Task<DeleteSongProposalResponseDto> DeleteAsync(int id, CancellationToken ct);
        Task<VoteSongProposalResponseDto> VoteAsync(int id, string voterIp, CancellationToken ct);
        Task<SetWinnerResponseDto> SetWinnerAsync(int id, CancellationToken ct);
        Task<ResetVotesResponseDto> ResetVotesAsync(CancellationToken ct);
    }
}