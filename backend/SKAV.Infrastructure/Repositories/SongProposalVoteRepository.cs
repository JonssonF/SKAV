using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class SongProposalVoteRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow) : ISongProposalVoteRepository
    {
        public async Task<bool> HasVotedOnActiveProposalAsync(
            string voterIp, IEnumerable<int> activeProposalIds, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT COUNT(1) FROM SongProposalVotes
                WHERE VoterIp = @VoterIp
                AND SongProposalId IN @Ids;
                """;

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { VoterIp = voterIp, Ids = activeProposalIds },
                cancellationToken: ct)) > 0;
        }

        public async Task CreateAsync(SongProposalVote vote, CancellationToken ct)
        {
            const string sql = """
                INSERT INTO SongProposalVotes (SongProposalId, VoterIp, CreatedAt)
                VALUES (@SongProposalId, @VoterIp, @CreatedAt);
                """;

            await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: vote,
                transaction: uow.Transaction,
                cancellationToken: ct));
        }

        public async Task<int> GetVoteCountAsync(int songProposalId, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT COUNT(1) FROM SongProposalVotes
                WHERE SongProposalId = @Id;
                """;

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = songProposalId },
                cancellationToken: ct));
        }

        public async Task<Dictionary<int, int>> GetVoteCountsAsync(
            IEnumerable<int> songProposalIds, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT SongProposalId, COUNT(1) AS VoteCount
                FROM SongProposalVotes
                WHERE SongProposalId IN @Ids
                GROUP BY SongProposalId;
                """;

            var results = await conn.QueryAsync<(int SongProposalId, int VoteCount)>(
                new CommandDefinition(
                    commandText: sql,
                    parameters: new { Ids = songProposalIds },
                    cancellationToken: ct));

            return results.ToDictionary(r => r.SongProposalId, r => r.VoteCount);
        }

        public async Task DeleteByProposalIdsAsync(
            IEnumerable<int> songProposalIds, CancellationToken ct)
        {
            const string sql = """
                DELETE FROM SongProposalVotes
                WHERE SongProposalId IN @Ids;
                """;

            await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { Ids = songProposalIds },
                transaction: uow.Transaction,
                cancellationToken: ct));
        }
    }
}