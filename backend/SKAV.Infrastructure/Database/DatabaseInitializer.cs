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

            const string sql = """
                CREATE TABLE IF NOT EXISTS Gigs (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Location TEXT NOT NULL,
                    Adress TEXT NULL,
                    Date TEXT NOT NULL,
                    Description TEXT NULL,
                    Price REAL NULL CHECK (Price IS NULL OR Price >= 0),
                    Notes TEXT NULL,
                    IsPrivate INTEGER NOT NULL DEFAULT 0,
                    TicketUrl TEXT NULL
                );
            """;

            await connection.ExecuteAsync(sql);

            const string indexSql = """
                CREATE UNIQUE INDEX IF NOT EXISTS idx_gigs_title_date
                ON Gigs (Title, Date);
            """;

            await connection.ExecuteAsync(indexSql);
        }
    }
}