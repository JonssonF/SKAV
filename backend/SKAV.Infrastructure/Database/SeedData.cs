using SKAV.Application.Common.Helpers;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;

namespace SKAV.Infrastructure.Database
{
    public class SeedData(
        IMemberRepository memberRepo,
        IGigRepository gigRepo,
        IInstrumentRepository instrumentRepo,
        IMemberInstrumentRepository memberInstrumentRepo,
        IAlbumRepository albumRepo,
        ISongRepository songRepo,
        ILyricsRepository lyricsRepo,
        IBookingRequestRepository bookingRequestRepo,
        IBookingRecipientRepository bookingRecipientRepo,
        IUnitOfWork uow)
    {
        public async Task SeedAsync(CancellationToken ct = default)
        {
            await SeedInstrumentsAsync(ct);
            await SeedMembersAsync(ct);
            await SeedMemberInstrumentsAsync(ct);
            await SeedGigsAsync(ct);
            await SeedAlbumsAsync(ct);
            await SeedSongsAsync(ct);
            await SeedLyricsAsync(ct);
            await SeedBookingRequestsAsync(ct);
            await SeedBookingRecipientsAsync(ct);
        }

        private async Task SeedInstrumentsAsync(CancellationToken ct)
        {
            var existing = await instrumentRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var instruments = new List<Instrument>
            {
                new() { Name = "Sång", Description = "Vokalist" },
                new() { Name = "Bas", Description = "Basgitarr" },
                new() { Name = "Gitarr", Description = "Elgitarr" },
                new() { Name = "Trummor", Description = "Trumset" },
                new() { Name = "Keyboard", Description = "Synthesizer" },
                new() { Name = "Akustisk gitarr", Description = "Akustisk gitarr" },
                new() { Name = "Munspel", Description = "Bluesmunspel" },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var instrument in instruments)
            {
                AuditHelper.SetCreated(instrument, null);
                await instrumentRepo.CreateAsync(instrument, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedMembersAsync(CancellationToken ct)
        {
            var existing = await memberRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var members = new List<Member>
            {
                new() { Name = "Klas", Quote = "Jag skriker!", DisplayOrder = 1 },
                new() { Name = "Maja", Quote = "Basen dundrar!", DisplayOrder = 2 },
                new() { Name = "Pelle", Quote = "Riff till frukost", DisplayOrder = 3 },
                new() { Name = "Lena", Quote = "Takten håller jag", DisplayOrder = 4 },
                new() { Name = "Jonas", Quote = "Tangenterna talar", DisplayOrder = 5 },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var member in members)
            {
                AuditHelper.SetCreated(member, null);
                await memberRepo.CreateAsync(member, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedMemberInstrumentsAsync(CancellationToken ct)
        {
            var existing = await memberInstrumentRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var memberInstruments = new List<MemberInstrument>
            {
                new() { MemberId = 1, InstrumentId = 1 },  // Klas - Sång
                new() { MemberId = 1, InstrumentId = 7 },  // Klas - Munspel
                new() { MemberId = 2, InstrumentId = 2 },  // Maja - Bas
                new() { MemberId = 2, InstrumentId = 1 },  // Maja - Sång (kör)
                new() { MemberId = 3, InstrumentId = 3 },  // Pelle - Gitarr
                new() { MemberId = 3, InstrumentId = 6 },  // Pelle - Akustisk gitarr
                new() { MemberId = 4, InstrumentId = 4 },  // Lena - Trummor
                new() { MemberId = 5, InstrumentId = 5 },  // Jonas - Keyboard
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var memberInstrument in memberInstruments)
            {
                AuditHelper.SetCreated(memberInstrument, null);
                await memberInstrumentRepo.CreateAsync(memberInstrument, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedGigsAsync(CancellationToken ct)
        {
            var existing = await gigRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var gigs = new List<Gig>
            {
                new()
                {
                    Title = "Skavfesten",
                    Location = "Varberg",
                    Adress = "Folkets park",
                    Date = new DateTimeOffset(2026, 6, 15, 20, 0, 0, TimeSpan.Zero),
                    Description = "Stor fest med SKAV på scen hela kvällen",
                    Price = 150,
                    Notes = "Fri entré före 21",
                    TicketUrl = "https://tickets.example.com/skavfesten",
                },
                new()
                {
                    Title = "Byfesten",
                    Location = "Tvååker",
                    Adress = "Torget",
                    Date = new DateTimeOffset(2026, 7, 1, 19, 0, 0, TimeSpan.Zero),
                    Description = "Live på torget – hela byn samlas!",
                    Price = 0,
                    Notes = "Ta med egen stol",
                },
                new()
                {
                    Title = "Privat Gig",
                    Location = "Himle",
                    Adress = "Bygdegården",
                    Date = new DateTimeOffset(2026, 8, 10, 21, 0, 0, TimeSpan.Zero),
                    Description = "Företagsevent med middag och livemusik",
                    Price = 0,
                    Notes = "Endast inbjudna",
                },
                new()
                {
                    Title = "Sommarrock",
                    Location = "Falkenberg",
                    Adress = "Strandbaden",
                    Date = new DateTimeOffset(2026, 7, 20, 18, 0, 0, TimeSpan.Zero),
                    Description = "Rockfestival på stranden med flera band",
                    Price = 250,
                    TicketUrl = "https://tickets.example.com/sommarrock",
                },
                new()
                {
                    Title = "Nyårsspelning",
                    Location = "Derome",
                    Adress = "Bygdegården",
                    Date = new DateTimeOffset(2026, 12, 31, 22, 0, 0, TimeSpan.Zero),
                    Description = "Ring in det nya året med SKAV!",
                    Price = 200,
                },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var gig in gigs)
            {
                AuditHelper.SetCreated(gig, null);
                await gigRepo.CreateAsync(gig, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedAlbumsAsync(CancellationToken ct)
        {
            var existing = await albumRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var albums = new List<Album>
            {
                new()
                {
                    Title = "Från Derome med kärlek",
                    Description = "Debutskivan – inspelad i Klasas garage en regnig höst.",
                    ReleaseDate = new DateTime(2024, 3, 15),
                    SpotifyUrl = "https://open.spotify.com/album/example1",
                },
                new()
                {
                    Title = "Andra varvet",
                    Description = "Uppföljaren – hårdare, snabbare, bättre.",
                    ReleaseDate = new DateTime(2025, 9, 1),
                    SpotifyUrl = "https://open.spotify.com/album/example2",
                },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var album in albums)
            {
                AuditHelper.SetCreated(album, null);
                await albumRepo.CreateAsync(album, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedSongsAsync(CancellationToken ct)
        {
            var existing = await songRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var songs = new List<Song>
            {
                // Album 1 - Från Derome med kärlek
                new() { AlbumId = 1, Title = "Byvägen hem", TrackNumber = 1, DurationSeconds = 215, Writer = "Klas" },
                new() { AlbumId = 1, Title = "Regn i juli", TrackNumber = 2, DurationSeconds = 192, Writer = "Maja" },
                new() { AlbumId = 1, Title = "Garagerock", TrackNumber = 3, DurationSeconds = 178, Writer = "Pelle" },
                new() { AlbumId = 1, Title = "Sista ölen", TrackNumber = 4, DurationSeconds = 245, Writer = "Klas & Maja" },
                new() { AlbumId = 1, Title = "Derome blues", TrackNumber = 5, DurationSeconds = 302, Writer = "Klas" },

                // Album 2 - Andra varvet
                new() { AlbumId = 2, Title = "Full gas", TrackNumber = 1, DurationSeconds = 168, Writer = "Pelle" },
                new() { AlbumId = 2, Title = "Nattskift", TrackNumber = 2, DurationSeconds = 234, Writer = "Klas" },
                new() { AlbumId = 2, Title = "Motorvägen", TrackNumber = 3, DurationSeconds = 199, Writer = "Maja & Pelle" },
                new() { AlbumId = 2, Title = "Svart kaffe", TrackNumber = 4, DurationSeconds = 221, Writer = "Jonas" },

                // Singlar (inget album)
                new() { Title = "Sommar i stan", DurationSeconds = 203, Writer = "Klas" },
                new() { Title = "Vintervila", DurationSeconds = 267, Writer = "Maja" },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var song in songs)
            {
                AuditHelper.SetCreated(song, null);
                await songRepo.CreateAsync(song, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedLyricsAsync(CancellationToken ct)
        {
            var existing = await lyricsRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var lyrics = new List<Lyrics>
            {
                new()
                {
                    SongId = 1, // Byvägen hem
                    Slug = "byvagen-hem",
                    Body = "Längs byvägen hem\nNär solen går ner\nJag hör musiken\nSom aldrig ger sig\n\nRefräng:\nByvägen hem, byvägen hem\nDet är där jag hör hemma\nByvägen hem, byvägen hem\nDit jag alltid kommer tillbaka",
                },
                new()
                {
                    SongId = 2, // Regn i juli
                    Slug = "regn-i-juli",
                    Body = "Regnet faller ner\nPå taken i vår by\nMen vi spelar på\nUnder himlens grå\n\nRefräng:\nRegn i juli\nKan inte stoppa oss\nRegn i juli\nVi kör ändå",
                },
                new()
                {
                    SongId = 5, // Derome blues
                    Slug = "derome-blues",
                    Body = "Vaknar upp i Derome\nKlockan halv fem\nKaffet är kallt\nMen bluesen är varm\n\nRefräng:\nDerome blues\nDet är allt jag har\nDerome blues\nVarje dag, varje kväll",
                },
                new()
                {
                    SongId = 7, // Nattskift
                    Slug = "nattskift",
                    Body = "Klockan slår tolv\nFabriken surrar på\nHänderna jobbar\nMen tankarna går\n\nRefräng:\nNattskift, nattskift\nSnart är det morgon\nNattskift, nattskift\nSnart är vi fria",
                },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var lyric in lyrics)
            {
                AuditHelper.SetCreated(lyric, null);
                await lyricsRepo.CreateAsync(lyric, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedBookingRequestsAsync(CancellationToken ct)
        {
            var existing = await bookingRequestRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var requests = new List<BookingRequest>
            {
                new()
                {
                    Name = "Anna Lindberg",
                    Email = "anna.lindberg@example.com",
                    Phone = "0701234567",
                    EventType = "Bröllop",
                    EventDate = new DateTimeOffset(2026, 8, 22, 16, 0, 0, TimeSpan.Zero),
                    Message = "Hej! Vi gifter oss i augusti och skulle älska att ha liveband på festen. Ni verkar ha precis den stilen vi letar efter. Kan ni spela 2-3 timmar?",
                    IsRead = false,
                },
                new()
                {
                    Name = "Erik Johansson",
                    Email = "erik@foretaget.se",
                    Phone = "0739876543",
                    EventType = "Företagsevent",
                    EventDate = new DateTimeOffset(2026, 9, 15, 18, 0, 0, TimeSpan.Zero),
                    Message = "Vi planerar en kickoff för 80 anställda och söker ett band. Budget finns. Hör av er med prisförslag!",
                    IsRead = true,
                    AnsweredAt = new DateTime(2026, 5, 1, 14, 30, 0),
                    AnsweredBy = 1,
                },
                new()
                {
                    Name = "Lisa Svensson",
                    Email = "lisa.s@gmail.com",
                    EventType = "Fest",
                    Message = "Hej! Fyller 40 i oktober och vill ha livemusik. Är ni lediga runt 18 oktober? Vi är ca 50 gäster.",
                    IsRead = false,
                },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var request in requests)
            {
                AuditHelper.SetCreated(request, null);
                await bookingRequestRepo.CreateAsync(request, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedBookingRecipientsAsync(CancellationToken ct)
        {
            var existing = await bookingRecipientRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var recipients = new List<BookingNotificationRecipient>
            {
                new() { Email = "admin@skav.se", MemberId = 1 },
                new() { Email = "maja@skav.se", MemberId = 2 },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var recipient in recipients)
            {
                AuditHelper.SetCreated(recipient, null);
                await bookingRecipientRepo.CreateAsync(recipient, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }
    }
}