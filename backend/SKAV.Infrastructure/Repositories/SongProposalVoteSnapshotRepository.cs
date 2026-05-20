using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class SongProposalVoteSnapshotRepository(
        IDbConnectionFactory db,
        IUnitOfWorkConnection uow) : ISongProposalVoteSnapshotRepository
    {
        public async Task CreateAsync(SongProposalVoteSnapshot snapshot, CancellationToken ct)
        {
            const string sql = """
                INSERT INTO SongProposalVoteSnapshots (SongProposalId, VoteCount, SnapshotDate)
                VALUES (@SongProposalId, @VoteCount, @SnapshotDate);
                """;

            await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: snapshot,
                transaction: uow.Transaction,
                cancellationToken: ct));
        }

        public async Task<IEnumerable<SongProposalVoteSnapshot>> GetByProposalIdAsync(
            int songProposalId, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM SongProposalVoteSnapshots
                WHERE SongProposalId = @Id
                ORDER BY SnapshotDate DESC;
                """;

            return await conn.QueryAsync<SongProposalVoteSnapshot>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = songProposalId },
                cancellationToken: ct));
        }

        public async Task<Dictionary<int, List<SongProposalVoteSnapshot>>> GetByProposalIdsAsync(
            IEnumerable<int> songProposalIds, CancellationToken ct)
        {
            using var conn = db.CreateConnection();
            conn.Open();

            const string sql = """
                SELECT * FROM SongProposalVoteSnapshots
                WHERE SongProposalId IN @Ids
                ORDER BY SnapshotDate DESC;
                """;

            var results = await conn.QueryAsync<SongProposalVoteSnapshot>(new CommandDefinition(
                commandText: sql,
                parameters: new { Ids = songProposalIds },
                cancellationToken: ct));

            return results
                .GroupBy(s => s.SongProposalId)
                .ToDictionary(g => g.Key, g => g.ToList());
        }

        public async Task DeleteOldestAsync(int songProposalId, int keepCount, CancellationToken ct)
        {
            const string sql = """
                DELETE FROM SongProposalVoteSnapshots
                WHERE Id NOT IN (
                    SELECT Id FROM SongProposalVoteSnapshots
                    WHERE SongProposalId = @Id
                    ORDER BY SnapshotDate DESC
                    LIMIT @Keep
                )
                AND SongProposalId = @Id;
                """;

            await uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = songProposalId, Keep = keepCount },
                transaction: uow.Transaction,
                cancellationToken: ct));
        }
    }
}