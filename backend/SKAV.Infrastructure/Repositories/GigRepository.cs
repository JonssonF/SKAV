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

        public GigRepository(IDbConnectionFactory connectionFactory) => _connectionFactory = connectionFactory;
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

        public Task<int> CreateGigAsync(Gig gig, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<Gig?> GetGigByIdAsync(int id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task UpdateGigAsync(Gig gig, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task DeleteGigAsync(int id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
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
