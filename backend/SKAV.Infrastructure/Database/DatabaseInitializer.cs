using BCrypt.Net;
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
        private readonly SeedData _seeder;

        public DatabaseInitializer(IDbConnectionFactory connectionFactory, SeedData seeder)
        {
            _connectionFactory = connectionFactory;
            _seeder = seeder;
        } 

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
                    TicketUrl TEXT NULL,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
            """;

            await connection.ExecuteAsync(sql);

            const string indexSql = """
                CREATE UNIQUE INDEX IF NOT EXISTS idx_gigs_title_date
                ON Gigs (Title, Date);
            """;

            await connection.ExecuteAsync(indexSql);


            const string sqlMembers = """
                CREATE TABLE IF NOT EXISTS Members (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Role TEXT NOT NULL,
                    Quote TEXT NULL,
                    ImageUrl TEXT NULL,
                    DisplayOrder INTEGER NOT NULL DEFAULT 0
                );
            """;

            await connection.ExecuteAsync(sqlMembers);

            const string sqlUsers = """
            CREATE TABLE IF NOT EXISTS Users(
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Email TEXT NOT NULL UNIQUE,
                PasswordHash TEXT NOT NULL,
                Role INTEGER NOT NULL
            );
            """;
            await connection.ExecuteAsync(sqlUsers);

            // Seed admin user if not exists
            var exists = await connection.ExecuteScalarAsync<int>(
            "SELECT COUNT(1) FROM Users WHERE Email = @Email",
            new { Email = "admin@skav.se" });

            if (exists == 0)
            {
                var hash = BCrypt.Net.BCrypt.HashPassword("1234");

                await connection.ExecuteAsync("""
            INSERT INTO Users (Email, PasswordHash, Role)
            VALUES (@Email, @PasswordHash, @Role)
            """, new
                {
                    Email = "admin@skav.se",
                    PasswordHash = hash,
                    Role = 1
                });
            }

            await _seeder.SeedAsync(connection);            
        }
    }
}