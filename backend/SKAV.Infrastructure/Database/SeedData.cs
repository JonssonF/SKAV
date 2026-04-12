using Dapper;
using SKAV.Domain.Models;
using System.Data;

namespace SKAV.Infrastructure.Database
{
    public class SeedData 
    {
        public async Task SeedAsync(IDbConnection connection)
        {
            await SeedBandMembers(connection);
            await SeedGigs(connection);
        }

        private async Task SeedBandMembers(IDbConnection connection)
        {
            var count = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Members;");

            if (count > 0) return;

            var members = new List<Member>
            {
                new() { Name = "Klas", Role = "Sång", Quote = "Jag skriker!", DisplayOrder = 1 },
                new() { Name = "Maja", Role = "Bas", Quote = "Basen dundrar!", DisplayOrder = 2 },
                new() { Name = "Pelle", Role = "Gitarr", DisplayOrder = 3 },
                new() { Name = "Lena", Role = "Trummor", DisplayOrder = 4 },
                new() { Name = "Jonas", Role = "Keyboard", DisplayOrder = 5 }
            };

                const string sql = """
                INSERT INTO BandMembers (Name, Role, Quote, ImageUrl, DisplayOrder)
                VALUES (@Name, @Role, @Quote, @ImageUrl, @DisplayOrder);
                """;

            await connection.ExecuteAsync(sql, members);
        }

        private async Task SeedGigs(IDbConnection connection)
        {
            var count = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Gigs;");

            if (count > 0) return;

            const string sql = """
            INSERT INTO Gigs (Title, Location, Adress, Date, Description, Price, Notes, IsPrivate, TicketUrl)
            VALUES
            ('Skavfesten', 'Varberg', 'Folkets park', '2026-06-15T20:00:00Z', 'Stor fest', 150, 'Fri entré före 21', 0, NULL),
            ('Byfesten', 'Tvååker', 'Torget', '2026-07-01T19:00:00Z', 'Live på torget', 0, NULL, 0, NULL),
            ('Privat Gig', 'Himle', 'Bygdegården', '2026-08-10T21:00:00Z', 'Företagsevent', 0, NULL, 1, NULL);
        """;

            await connection.ExecuteAsync(sql);
        }
    }
}

    
        
 
