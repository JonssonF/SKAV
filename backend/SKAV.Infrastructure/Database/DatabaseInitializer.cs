using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace SKAV.Infrastructure.Database
{
    public sealed class DatabaseInitializer(
    IDbConnectionFactory connectionFactory,
    IConfiguration configuration)
    {
        public async Task InitializeAsync()
        {
            SqlMapper.AddTypeHandler(new DateTimeOffsetHandler());

            using var connection = connectionFactory.CreateConnection();
            connection.Open();

            await connection.ExecuteAsync("PRAGMA foreign_keys = ON;");

            const string sqlGigs = """
                CREATE TABLE IF NOT EXISTS Gigs (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Location TEXT NOT NULL,
                    Adress TEXT NULL,
                    Date TEXT NOT NULL,
                    Description TEXT NULL,
                    Price REAL NULL CHECK (Price IS NULL OR Price >= 0),
                    Notes TEXT NULL,
                    TicketUrl TEXT NULL,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
                """;
            await connection.ExecuteAsync(sqlGigs);

            const string indexSql = """
            CREATE UNIQUE INDEX IF NOT EXISTS idx_gigs_title_date
            ON Gigs (Title, Date);
            """;
            await connection.ExecuteAsync(indexSql);

            const string sqlMembers = """
                CREATE TABLE IF NOT EXISTS Members (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Role TEXT NULL,
                    Bio TEXT NULL,
                    Quote TEXT NULL,
                    ImageUrl TEXT NULL,
                    DisplayOrder INTEGER NOT NULL DEFAULT 0,
                    UserId INTEGER NULL,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY (UserId) REFERENCES Users(Id)
                );
                """;
            await connection.ExecuteAsync(sqlMembers);

            const string sqlUsers = """
                CREATE TABLE IF NOT EXISTS Users (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Email TEXT NOT NULL UNIQUE,
                PasswordHash TEXT NOT NULL,
                Roles INTEGER NOT NULL,
                MemberId INTEGER,
                CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CreatedBy INTEGER,
                UpdatedAt TEXT,
                UpdatedBy INTEGER,
                DeletedAt TEXT,
                DeletedBy INTEGER,
                FOREIGN KEY(MemberId) REFERENCES Members(Id)
                );
                """;
            await connection.ExecuteAsync(sqlUsers);

            const string sqlSubscribers = """
                CREATE TABLE IF NOT EXISTS Subscribers (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Email TEXT NOT NULL UNIQUE,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
                """;
            await connection.ExecuteAsync(sqlSubscribers);

            const string sqlAlbums = """
                CREATE TABLE IF NOT EXISTS Albums (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    CoverImageUrl TEXT NULL,
                    ReleaseDate TEXT NULL,
                    SpotifyUrl TEXT NULL,
                    Description TEXT NULL,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
                """;
            await connection.ExecuteAsync(sqlAlbums);

            const string sqlSongs = """
                CREATE TABLE IF NOT EXISTS Songs (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    AlbumId INTEGER NULL,
                    Title TEXT NOT NULL,
                    DurationSeconds INTEGER NULL,
                    SpotifyUrl TEXT NULL,
                    MusicWriter TEXT,
                    LyricsWriter TEXT,
                    YoutubeUrl TEXT NULL,
                    Year INTEGER NULL,
                    TrackNumber INTEGER NULL,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY (AlbumId) REFERENCES Albums(Id)
                );
                """;
            await connection.ExecuteAsync(sqlSongs);

            const string sqlLyrics = """
                CREATE TABLE IF NOT EXISTS Lyrics (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SongId INTEGER NOT NULL,
                    Slug TEXT NOT NULL UNIQUE,
                    Body TEXT NOT NULL,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY (SongId) REFERENCES Songs(Id)
                );
                """;
            await connection.ExecuteAsync(sqlLyrics);

            const string sqlBookingRequests = """
                
                CREATE TABLE IF NOT EXISTS BookingRequests(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Email TEXT NOT NULL,
                    Phone TEXT,
                    EventDate TEXT,
                    EventType TEXT,
                    Message TEXT NOT NULL,
                    IsRead INTEGER NOT NULL DEFAULT 0,
                    AnsweredAt TEXT,
                    AnsweredBy INTEGER,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
                """;
            await connection.ExecuteAsync(sqlBookingRequests);

            const string sqlBookingNotificationRecipients = """
                CREATE TABLE IF NOT EXISTS BookingNotificationRecipients(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Email TEXT NOT NULL,
                    MemberId INTEGER,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY(MemberId) REFERENCES Members(Id)
                );
            """;
            await connection.ExecuteAsync(sqlBookingNotificationRecipients);

            const string sqlProducts = """
                CREATE TABLE IF NOT EXISTS Products(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Description TEXT NOT NULL,
                    Price DECIMAL(10,2) NOT NULL,
                    Category TEXT,
                    IsSignable INTEGER NOT NULL DEFAULT 0,
                    SigningPrice DECIMAL(10,2),
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
                """;
            await connection.ExecuteAsync(sqlProducts);

            const string sqlProductImages = """
                CREATE TABLE IF NOT EXISTS ProductImages(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ProductId INTEGER NOT NULL,
                    ImageUrl TEXT NOT NULL,
                    IsPrimary INTEGER NOT NULL DEFAULT 0,
                    DisplayOrder INTEGER NOT NULL DEFAULT 0,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY(ProductId) REFERENCES Products(Id)
                );
                """;
            await connection.ExecuteAsync(sqlProductImages);

            const string sqlProductOrders = """
                CREATE TABLE IF NOT EXISTS ProductOrders(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Email TEXT NOT NULL,
                    Phone TEXT,
                    Address TEXT,
                    City TEXT,
                    PostalCode TEXT,
                    Message TEXT,
                    IsHandled INTEGER NOT NULL DEFAULT 0,
                    HandledAt TEXT,
                    HandledBy INTEGER,
                    IsCancelled INTEGER NOT NULL DEFAULT 0,
                    CancelledAt TEXT,
                    CancelledBy INTEGER,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
                """;
            await connection.ExecuteAsync(sqlProductOrders);

            const string sqlProductVariants = """
                CREATE TABLE IF NOT EXISTS ProductVariants(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ProductId INTEGER NOT NULL,
                    Attributes TEXT NOT NULL,
                    PriceOverride DECIMAL(10,2),
                    StockQuantity INTEGER NOT NULL DEFAULT 0,
                    Version INTEGER NOT NULL DEFAULT 1,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY(ProductId) REFERENCES Products(Id)
                );
                """;
            await connection.ExecuteAsync(sqlProductVariants);

            const string sqlProductOrderItems = """
                CREATE TABLE IF NOT EXISTS ProductOrderItems(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ProductOrderId INTEGER NOT NULL,
                    ProductId INTEGER NOT NULL,
                    ProductVariantId INTEGER NOT NULL,
                    Quantity INTEGER NOT NULL,
                    IsSigned INTEGER NOT NULL DEFAULT 0,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY(ProductOrderId) REFERENCES ProductOrders(Id),
                    FOREIGN KEY(ProductId) REFERENCES Products(Id),
                    FOREIGN KEY(ProductVariantId) REFERENCES ProductVariants(Id)
                );
                """;
            await connection.ExecuteAsync(sqlProductOrderItems);

            const string sqlProductOrderNotificationsRecipients = """
                CREATE TABLE IF NOT EXISTS ProductOrderNotificationRecipients(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Email TEXT NOT NULL,
                    MemberId INTEGER,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY(MemberId) REFERENCES Members(Id)
                );
                """;
            await connection.ExecuteAsync(sqlProductOrderNotificationsRecipients);

            const string sqlProductAttributeDefinitions = """
                CREATE TABLE IF NOT EXISTS ProductAttributeDefinitions(
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ProductId INTEGER NOT NULL,
                    Name TEXT NOT NULL,
                    AttributeValues TEXT NOT NULL,
                    DisplayOrder INTEGER NOT NULL DEFAULT 0,
                    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER,
                    FOREIGN KEY(ProductId) REFERENCES Products(Id)
                );
                """;
            await connection.ExecuteAsync(sqlProductAttributeDefinitions);

            const string sqlSongProposals = """
                CREATE TABLE IF NOT EXISTS SongProposals (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Description TEXT NULL,
                    LyricsBody TEXT NULL,
                    IsActive INTEGER NOT NULL DEFAULT 0,
                    IsWinner INTEGER NOT NULL DEFAULT 0,
                    CreatedAt TEXT NOT NULL,
                    CreatedBy INTEGER,
                    UpdatedAt TEXT,
                    UpdatedBy INTEGER,
                    DeletedAt TEXT,
                    DeletedBy INTEGER
                );
                """;
            await connection.ExecuteAsync(sqlSongProposals);

            const string sqlSongProposalVotes = """
                CREATE TABLE IF NOT EXISTS SongProposalVotes (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SongProposalId INTEGER NOT NULL,
                    VoterIp TEXT NOT NULL,
                    CreatedAt TEXT NOT NULL,
                    FOREIGN KEY (SongProposalId) REFERENCES SongProposals(Id)
                );
                """;
            await connection.ExecuteAsync(sqlSongProposalVotes);

            const string indexSongProposalVoterIp = """
                CREATE UNIQUE INDEX IF NOT EXISTS idx_song_proposal_voter_ip
                ON SongProposalVotes (SongProposalId, VoterIp);
                """;
            await connection.ExecuteAsync(indexSongProposalVoterIp);

            const string sqlSongProposalVoteSnapshots = """
                CREATE TABLE IF NOT EXISTS SongProposalVoteSnapshots (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SongProposalId INTEGER NOT NULL,
                    VoteCount INTEGER NOT NULL,
                    SnapshotDate TEXT NOT NULL,
                    FOREIGN KEY (SongProposalId) REFERENCES SongProposals(Id)
                );
                """;
            await connection.ExecuteAsync(sqlSongProposalVoteSnapshots);

            await SeedAdminAsync(connection);
        }
        private async Task SeedAdminAsync(IDbConnection connection)
        {
            var adminPassword = configuration["Seed:AdminPassword"]
                ?? throw new InvalidOperationException("Admin seed password not configured.");

            var users = new[]
            {
                new { Email = "admin@skav.se", Roles = 1 },   // Admin
                new { Email = "editor@skav.se", Roles = 2 },   // Editor
                new { Email = "member@skav.se", Roles = 4 },   // Member
            };

            foreach (var user in users)
            {
                var exists = await connection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(1) FROM Users WHERE Email = @Email",
                    new { user.Email });

                if (exists > 0) continue;

                var hash = BCrypt.Net.BCrypt.HashPassword(adminPassword);

                await connection.ExecuteAsync(@"
            INSERT OR IGNORE INTO Users (Email, PasswordHash, Roles, CreatedAt)
            VALUES (@Email, @PasswordHash, @Roles, @CreatedAt)",
                    new
                    {
                        user.Email,
                        PasswordHash = hash,
                        user.Roles,
                        CreatedAt = DateTime.UtcNow.ToString("O")
                    });
            }
        }
    }
}