using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Infrastructure.Database
{
    public sealed class DatabaseInitializer
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public DatabaseInitializer(IDbConnectionFactory connectionFactory) => _connectionFactory = connectionFactory;

        public async Task InitializeAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            connection.Open();

            // Necessary for foreign key constraints to work in SQLite
            await connection.ExecuteAsync("PRAGMA foreign_keys = ON;");

            // Create Gigs table if it doesn't exist
            const string sql = """
                CREATE TABLE IF NOT EXISTS Gigs (
                    GigId INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Location TEXT NOT NULL,
                    Date TEXT NOT NULL,
                    Description TEXT NULL,
                    Price REAL NULL,
                    Notes TEXT NULL,
                    IsPrivate INTEGER NOT NULL,
                    TicketUrl TEXT NULL
                );
                """;

            await connection.ExecuteAsync(sql);
        }
    }
}