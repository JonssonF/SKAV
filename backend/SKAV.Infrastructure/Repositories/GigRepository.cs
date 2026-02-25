using Dapper;
using SKAV.Application.Interfaces;
using SKAV.Domain.Models;
using SKAV.Infrastructure.Database;
using System.Globalization;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class GigRepository : IGigRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public GigRepository(IDbConnectionFactory connectionFactory) 
            => _connectionFactory = connectionFactory;

        public async Task<IReadOnlyList<Gig>> GetAllGigsAsync(CancellationToken cancellationToken)
        {
            const string sql = """
                SELECT
                    Id,
                    Title,
                    Description,
                    Location,
                    Date,
                    Price,
                    Notes,
                    IsPrivate,
                    TicketUrl
                FROM Gigs
                ORDER BY Date DESC;
                """;

            using var connection = _connectionFactory.CreateConnection();
            connection.Open();

            var rows = await connection.QueryAsync<GigRow>(new CommandDefinition(
                commandText: sql,
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
                    TicketUrl
                FROM Gigs
                WHERE Id = @Id
                LIMIT 1;
                """;

            using var connection = _connectionFactory.CreateConnection();
            connection.Open();

            var row = await connection.QuerySingleOrDefaultAsync<GigRow>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                cancellationToken: cancellationToken));

            return row is null ? null : Map(row);
        }

        public async Task<int> CreateGigAsync(Gig gig, CancellationToken cancellationToken)
        {
            const string sql = """
        INSERT INTO Gigs (Title, Location, Date, Description, Price, Notes, IsPrivate, TicketUrl)
        VALUES (@Title, @Location, @Date, @Description, @Price, @Notes, @IsPrivate, @TicketUrl);

        SELECT last_insert_rowid();
        """;

            using var connection = _connectionFactory.CreateConnection();
            connection.Open();

            var id = await connection.ExecuteScalarAsync<long>(new CommandDefinition(
                commandText: sql,
                parameters: new
                {
                    gig.Title,
                    gig.Location,
                    Date = gig.Date.ToUniversalTime().ToString("O"),
                    gig.Description,
                    gig.Price,
                    gig.Notes,
                    IsPrivate = gig.IsPrivate ? 1 : 0,
                    gig.TicketUrl
                },
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
            TicketUrl = @TicketUrl
        WHERE Id = @Id;
        """;

            using var connection = _connectionFactory.CreateConnection();
            connection.Open();

            var affected = await connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new
                {
                    gig.Id,
                    gig.Title,
                    gig.Location,
                    Date = gig.Date.ToUniversalTime().ToString("O"),
                    gig.Description,
                    gig.Price,
                    gig.Notes,
                    IsPrivate = gig.IsPrivate ? 1 : 0,
                    gig.TicketUrl
                },
                cancellationToken: cancellationToken));

            if (affected == 0)
                throw new KeyNotFoundException($"Gig with id {gig.Id} not found.");
        }

        public async Task DeleteGigAsync(int id, CancellationToken cancellationToken)
        {
            const string sql = """
        DELETE FROM Gigs
        WHERE Id = @Id;
        """;

            using var connection = _connectionFactory.CreateConnection();
            connection.Open();

            var affected = await connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                cancellationToken: cancellationToken));

            if (affected == 0)
                throw new KeyNotFoundException($"Gig with id {id} not found.");
        }

        private static Gig Map(GigRow row)
        {
            var date = DateTime.Parse(row.Date, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);

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
                TicketUrl = row.TicketUrl
            };
        }

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
        }
    }
}
