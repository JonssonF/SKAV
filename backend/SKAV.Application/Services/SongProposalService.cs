using SKAV.Application.Common.Helpers;
using SKAV.Application.DTOs.SongProposal;
using SKAV.Application.DTOs.SongProposalVoteSnapshot;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services.Interface;
using SKAV.Domain.Consts;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Application.Services
{
    public class SongProposalService(
        ISongProposalRepository repo,
        ISongProposalVoteRepository voteRepo,
        ISongProposalVoteSnapshotRepository snapshotRepo,
        IUserRepository userRepo,
        ICurrentUserService currentUser,
        IUnitOfWork uow) : ISongProposalService
    {
        public async Task<IEnumerable<SongProposalResponseDto>> GetAllAsync(CancellationToken ct)
        {
            var proposals = (await repo.GetAllAsync(ct)).ToList();
            if (proposals.Count == 0) return [];

            var ids = proposals.Select(p => p.Id).ToList();

            var voteCounts = await voteRepo.GetVoteCountsAsync(ids, ct);
            var snapshots = await snapshotRepo.GetByProposalIdsAsync(ids, ct);

            var users = await userRepo.GetAllAsync(ct);
            var userLookup = users.ToDictionary(u => u.Id, u => u.Email);

            return proposals
                .OrderByDescending(p => p.IsActive)
                .ThenByDescending(p => voteCounts.GetValueOrDefault(p.Id, 0))
                .Select(p => MapToDto(p, voteCounts, snapshots, userLookup));
        }

        public async Task<SongProposalResponseDto> GetByIdAsync(int id, CancellationToken ct)
        {
            var proposal = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongProposalNotFound);

            var voteCount = await voteRepo.GetVoteCountAsync(id, ct);
            var snapshots = await snapshotRepo.GetByProposalIdAsync(id, ct);

            string? createdByEmail = null;
            if (proposal.CreatedBy.HasValue)
            {
                var user = await userRepo.GetByIdAsync(proposal.CreatedBy.Value, ct);
                createdByEmail = user?.Email;
            }

            return new SongProposalResponseDto
            {
                Id = proposal.Id,
                Title = proposal.Title,
                Description = proposal.Description,
                LyricsBody = proposal.LyricsBody,
                IsActive = proposal.IsActive,
                IsWinner = proposal.IsWinner,
                VoteCount = voteCount,
                CreatedByEmail = createdByEmail,
                VoteHistory = snapshots.Select(s => new SongProposalVoteSnapshotDto
                {
                    VoteCount = s.VoteCount,
                    SnapshotDate = s.SnapshotDate
                }).ToList()
            };
        }

        public async Task<CreateSongProposalResponseDto> CreateAsync(
            CreateSongProposalRequestDto dto, CancellationToken ct)
        {
            var proposal = new SongProposal
            {
                Title = dto.Title,
                Description = dto.Description,
                LyricsBody = dto.LyricsBody,
                IsActive = dto.IsActive
            };

            AuditHelper.SetCreated(proposal, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.CreateAsync(proposal, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new CreateSongProposalResponseDto();
        }

        public async Task<UpdateSongProposalResponseDto> UpdateAsync(
            int id, UpdateSongProposalRequestDto dto, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongProposalNotFound);

            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.LyricsBody = dto.LyricsBody;
            existing.IsActive = dto.IsActive;
            AuditHelper.SetUpdated(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new UpdateSongProposalResponseDto();
        }

        public async Task<DeleteSongProposalResponseDto> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongProposalNotFound);

            AuditHelper.SetDeleted(existing, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.DeleteAsync(id, existing, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new DeleteSongProposalResponseDto();
        }

        public async Task<VoteSongProposalResponseDto> VoteAsync(
            int id, string voterIp, CancellationToken ct)
        {
            var proposal = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongProposalNotFound);

            if (!proposal.IsActive)
                throw new BusinessRuleException(BusinessRules.SongProposalNotActive);

            // Hämta alla aktiva förslags-ids för att kolla om IP:n redan röstat
            var allProposals = await repo.GetAllAsync(ct);
            var activeIds = allProposals.Where(p => p.IsActive).Select(p => p.Id).ToList();

            if (await voteRepo.HasVotedOnActiveProposalAsync(voterIp, activeIds, ct))
                throw new BusinessRuleException(BusinessRules.SongProposalAlreadyVoted);

            var vote = new SongProposalVote
            {
                SongProposalId = id,
                VoterIp = voterIp,
                CreatedAt = DateTimeOffset.Now.UtcDateTime
            };

            using var scope = uow.BeginTransactionScope();
            await voteRepo.CreateAsync(vote, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new VoteSongProposalResponseDto();
        }

        public async Task<SetWinnerResponseDto> SetWinnerAsync(int id, CancellationToken ct)
        {
            var proposal = await repo.GetByIdAsync(id, ct)
                ?? throw new NotFoundException(BusinessRules.SongProposalNotFound);

            if (!proposal.IsActive)
                throw new BusinessRuleException(BusinessRules.SongProposalNotActive);

            proposal.IsWinner = true;
            AuditHelper.SetUpdated(proposal, currentUser.UserId);

            using var scope = uow.BeginTransactionScope();
            await repo.UpdateAsync(proposal, ct);
            await scope.CommitTransactionScopeAsync(ct);

            return new SetWinnerResponseDto();
        }

        public async Task<ResetVotesResponseDto> ResetVotesAsync(CancellationToken ct)
        {
            var allProposals = (await repo.GetAllAsync(ct)).ToList();
            var activeIds = allProposals.Where(p => p.IsActive).Select(p => p.Id).ToList();

            if (activeIds.Count == 0) return new ResetVotesResponseDto();

            // Hämta nuvarande röstantal för snapshots
            var voteCounts = await voteRepo.GetVoteCountsAsync(activeIds, ct);

            using var scope = uow.BeginTransactionScope();

            // Skapa snapshots för alla aktiva förslag som har röster
            foreach (var id in activeIds)
            {
                var count = voteCounts.GetValueOrDefault(id, 0);
                if (count == 0) continue;

                var snapshot = new SongProposalVoteSnapshot
                {
                    SongProposalId = id,
                    VoteCount = count,
                    SnapshotDate = DateTime.UtcNow
                };

                await snapshotRepo.CreateAsync(snapshot, ct);
                await snapshotRepo.DeleteOldestAsync(id, 3, ct);
            }

            // Radera alla röster
            await voteRepo.DeleteByProposalIdsAsync(activeIds, ct);

            // Nollställ vinnare
            foreach (var proposal in allProposals.Where(p => p.IsWinner))
            {
                proposal.IsWinner = false;
                AuditHelper.SetUpdated(proposal, currentUser.UserId);
                await repo.UpdateAsync(proposal, ct);
            }

            await scope.CommitTransactionScopeAsync(ct);

            return new ResetVotesResponseDto();
        }

        private static SongProposalResponseDto MapToDto(
            SongProposal p,
            Dictionary<int, int> voteCounts,
            Dictionary<int, List<SongProposalVoteSnapshot>> snapshots,
            Dictionary<int, string> userLookup) => new()
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                LyricsBody = p.LyricsBody,
                IsActive = p.IsActive,
                IsWinner = p.IsWinner,
                VoteCount = voteCounts.GetValueOrDefault(p.Id, 0),
                CreatedByEmail = p.CreatedBy.HasValue && userLookup.ContainsKey(p.CreatedBy.Value)
                ? userLookup[p.CreatedBy.Value]
                : null,
                VoteHistory = snapshots.TryGetValue(p.Id, out var history)
                ? history.Select(s => new SongProposalVoteSnapshotDto
                {
                    VoteCount = s.VoteCount,
                    SnapshotDate = s.SnapshotDate
                }).ToList()
                : []
            };
    }
}