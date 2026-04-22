using Dapper;
using SKAV.Application.Interfaces;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;
using System.Data;
using System.Data.Common;
using System.Globalization;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class GigRepository : IGigRepository
    {
        private readonly IUnitOfWorkConnection _connection;

        public GigRepository(IUnitOfWorkConnection connection)
            => _connection = connection;

        public async Task<IReadOnlyList<Gig>> GetAllGigsAsync(CancellationToken cancellationToken)
        {
            const string sql = """
                SELECT * FROM Gigs
                WHERE DeletedAt IS NULL
                ORDER BY Date DESC;
                """;

            var rows = await _connection.Connection.QueryAsync<GigRow>(new CommandDefinition(
                commandText: sql,
                transaction: _connection.Transaction,
                cancellationToken: cancellationToken));

            return rows.Select(Map).ToList();
        }

        public async Task<Gig?> GetGigByIdAsync(int id, CancellationToken cancellationToken)
        {
            const string sql = """
                SELECT
                    Id,
                    Title,
                    Location,
                    Date,
                    Description,
                    Price,
                    Notes,
                    IsPrivate,
                    TicketUrl,
                    CreatedAt,
                    CreatedBy,
                    UpdatedAt,
                    UpdatedBy,
                    DeletedAt,
                    DeletedBy
                FROM Gigs
                WHERE Id = @Id
                AND DeletedAt IS NULL
                LIMIT 1;
                """;

            var row = await _connection.Connection.QuerySingleOrDefaultAsync<GigRow>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                transaction: _connection.Transaction,
                cancellationToken: cancellationToken));

            return row is null ? null : Map(row);
        }

        public async Task<int> CreateGigAsync(Gig gig, CancellationToken cancellationToken)
        {
            const string sql = """
                INSERT INTO Gigs 
                (Title, Location, Date, Description, Price, Notes, IsPrivate, TicketUrl,
                 CreatedAt, CreatedBy)
                VALUES 
                (@Title, @Location, @Date, @Description, @Price, @Notes, @IsPrivate, @TicketUrl,
                 @CreatedAt, @CreatedBy);

                SELECT last_insert_rowid();
                """;

            var id = await _connection.Connection.ExecuteScalarAsync<long>(new CommandDefinition(
                commandText: sql,
                parameters: ToParameters(gig),
                transaction: _connection.Transaction,
                cancellationToken: cancellationToken));

            return (int)id;
        }

        public async Task UpdateGigAsync(Gig gig, CancellationToken cancellationToken)
        {
            const string sql = """
                UPDATE Gigs
                SET
                    Title = @Title,
                    Location = @Location,
                    Date = @Date,
                    Description = @Description,
                    Price = @Price,
                    Notes = @Notes,
                    IsPrivate = @IsPrivate,
                    TicketUrl = @TicketUrl,
                    UpdatedAt = @UpdatedAt,
                    UpdatedBy = @UpdatedBy
                WHERE Id = @Id
                AND DeletedAt IS NULL;
                """;

            var affected = await _connection.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: ToParameters(gig),
                transaction: _connection.Transaction,
                cancellationToken: cancellationToken));

            if (affected == 0)
                throw new KeyNotFoundException($"Gig with id {gig.Id} not found.");
        }

        public async Task DeleteGigAsync(int id, CancellationToken cancellationToken)
        {
            const string sql = """
                UPDATE Gigs
                SET
                    DeletedAt = @DeletedAt,
                    DeletedBy = @DeletedBy
                WHERE Id = @Id
                AND DeletedAt IS NULL;
                """;

            var affected = await _connection.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                transaction: _connection.Transaction,
                cancellationToken: cancellationToken));

            if (affected == 0)
                throw new KeyNotFoundException($"Gig with id {id} not found.");
        }

        private static Gig Map(GigRow row)
        {
            var date = DateTimeOffset.Parse(row.Date, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);

            return new Gig
            {
                Id = row.Id,
                Title = row.Title,
                Description = row.Description ?? string.Empty,
                Location = row.Location,
                Date = date,
                Price = row.Price,
                Notes = row.Notes,
                IsPrivate = row.IsPrivate == 1,
                TicketUrl = row.TicketUrl,
                CreatedAt = row.CreatedAt,
                CreatedBy = row.CreatedBy,
                UpdatedAt = row.UpdatedAt,
                UpdatedBy = row.UpdatedBy,
                DeletedAt = row.DeletedAt,
                DeletedBy = row.DeletedBy
            };
        }

        public async Task<int> GetGigCountAsync(CancellationToken cancellationToken)
        {
            const string sql = """
                SELECT COUNT(*)
                FROM Gigs;
                """;
            return await _connection.Connection.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                transaction: _connection.Transaction,   
                cancellationToken: cancellationToken));
        }

        public async Task<bool> ExistsAsync(string title, DateTimeOffset date, int? excludeId, CancellationToken ct)
        {
            const string sql = """
                SELECT COUNT(1)
                FROM Gigs
                WHERE Title = @Title
                AND Date = @Date
                AND DeletedAt IS NULL
                AND (@ExcludeId IS NULL OR ID != @ExcludeId);
                """;


            var count = await _connection.Connection.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new
                {
                    Title = title,
                    Date = date.ToUniversalTime().ToString("O"),
                    ExcludeId = excludeId
                },
                transaction: _connection.Transaction,
                cancellationToken: ct));

            return count > 0;
        }

        private static object ToParameters(Gig gig) => new
        {
            gig.Id,
            gig.Title,
            gig.Location,
            Date = gig.Date.ToUniversalTime().ToString("O"),
            gig.Description,
            gig.Price,
            gig.Notes,
            IsPrivate = gig.IsPrivate ? 1 : 0,
            gig.TicketUrl,
            gig.CreatedAt,
            gig.CreatedBy,
            gig.UpdatedAt,
            gig.UpdatedBy,
            gig.DeletedAt,
            gig.DeletedBy
        };

        private sealed class GigRow
        {
            public int Id { get; init; }
            public required string Title { get; init; }
            public required string Location { get; init; }
            public required string Date { get; init; }
            public string? Description { get; init; }
            public decimal? Price { get; init; }
            public string? Notes { get; init; }
            public int IsPrivate { get; init; }
            public string? TicketUrl { get; init; }
            public DateTime CreatedAt { get; init; }
            public int? CreatedBy { get; init; }
            public DateTime? UpdatedAt { get; init; }
            public int? UpdatedBy { get; init; }
            public DateTime? DeletedAt { get; init; }
            public int? DeletedBy { get; init; }
        }
    }
}