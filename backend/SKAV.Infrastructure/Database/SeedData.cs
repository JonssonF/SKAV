using Microsoft.Data.Sqlite;
using SKAV.Application.Common.Helpers;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;

namespace SKAV.Infrastructure.Database
{
    public class SeedData(
        IMemberRepository memberRepo,
        IGigRepository gigRepo,
        ISongRepository songRepo,
        ISiteSettingRepository siteRepo,
        IUnitOfWork uow)
    {
        public async Task SeedAsync(CancellationToken ct = default)
        {
            await SeedSiteSettingsAsync(ct);
            await SeedMembersAsync(ct);
            await SeedGigsAsync(ct);
            await SeedSongsAsync(ct);
        }

        private async Task SeedSiteSettingsAsync(CancellationToken ct)
        {
            var settings = new List<SiteSetting>
            {
                new()
                {
                    Key = "ShopPaused",
                    Value = "false"
                },
                new()
                {
                    Key = "ShopPausedMessage",
                    Value = "Vi tar inte emot beställningar just nu – prenumerera på vårt nyhetsbrev så meddelar vi när shopen öppnar igen!"
                },
                new()
                {
                    Key = "BookingPaused",
                    Value = "false"
                },
                new()
                {
                    Key = "BookingPausedMessage",
                    Value = "Vi tar inte emot bokningar just nu – prenumerera på vårt nyhetsbrev så meddelar vi när vi öppnar igen!"
                }
            };

            using var scope = uow.BeginTransactionScope();

            foreach (var setting in settings)
            {
                if (await siteRepo.GetByKeyAsync(setting.Key, ct) is not null)
                    continue;

                await siteRepo.CreateAsync(setting, ct);
            }

            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedMembersAsync(CancellationToken ct)
        {
            var existing = await memberRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var members = new List<Member>
            {
                new()
                {
                    Name = "Peter Mercury",
                    Role = "Sångare",
                    Bio = "Peter Mercury är frontfigur och den som ansvarar för ljudbild och helhetsupplevelsen. Känner till en bra lokal pizzeria i Derome.\nPratar gärna om känslor, sparknep och bra handverktyg.",
                    DisplayOrder = 1,
                },
                new()
                {
                    Name = "Ola-La",
                    Role = "Batterist",
                    Bio = "Ola-la är trummis i Skav och tvekar aldrig när en låt behöver öka eller minska i tempo. Till skillnad från många andra trummisar klarar han dessutom av att justera tempot flera gånger under samma låt. När det vankas dejt med frugan rankar han den lokala korvkiosken som ett alldeles utmärkt alternativ.",
                    DisplayOrder = 2,
                },
                new()
                {
                    Name = "BP Buk-Pianisten",
                    Role = "Bukpianist",
                    Bio = "Anders Bukpianist är bandets framkant som helst står i bakkant. Han har testat en imponerande mängd lunchställen mellan Derome och Rättvik och delar gärna med sig av sina erfarenheter. En gång hade han bråttom – det pratas fortfarande om det.",
                    DisplayOrder = 3,
                },
                new()
                {
                    Name = "Eddie felspel Linné",
                    Role = "Gitarrist",
                    Bio = "Eddie Van Häjlen är Skavs kompgitarrist och lider av en svår allergi mot den ständiga baktakt han tvingas utstå i bandet. Han vet var man hittar den bästa lunchbuffén i Muskat.",
                    DisplayOrder = 4,
                },
                new()
                {
                    Name = "Leo Kilimister",
                    Role = "Basist",
                    Bio = "Leo Kilmister spelar bas i Skav och har gjort det sedan hösten 2023. På scen dansar han gärna mer än han spelar. I skrivande stund äger han tre basgitarrer, och hans matintresse styrs till stor del av hur mycket ADHD-medicin han har tagit under dagen.",
                    DisplayOrder = 5,
                },
                new()
                {
                    Name = "B-bender Filip",
                    Role = "Gitarrist",
                    Bio = "Filip B-Bender är bandets motvilliga kapellmästare. Uppvuxen på fläskkotlett och Blå Bands pulversås. Insåg först sent i livet att brysselkål faktiskt är gott. Äger en ovanligt bra klyvyxa.",
                    DisplayOrder = 6,
                },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var member in members)
            {
                AuditHelper.SetCreated(member, null);
                await memberRepo.CreateAsync(member, ct);
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
                    Title = "Gården Vid Bron",
                    Location = "Veddige",
                    Adress = "ÅSBRO 1, 432 68",
                    Date = new DateTimeOffset(2025, 6, 3, 19, 15, 0, TimeSpan.Zero),
                    Description = "Förband till 2 Blyga Läppar.",
                    Price = 0,
                    TicketUrl = "https://www.gardenvidbron.se/",
                },
                new()
                {
                    Title = "Majas Vid Havet",
                    Location = "Varberg",
                    Adress = "Tångkörarvägen 15, 432 54",
                    Date = new DateTimeOffset(2026, 8, 8, 20, 0, 0, TimeSpan.Zero),
                    Description = "Entré från 18:00, kom och värm upp!",
                    Price = 225,
                    TicketUrl = "https://www.majas.nu/evenemang",
                },
                new()
                {
                    Title = "Kärleksparken",
                    Location = "Ankaret i Varberg",
                    Adress = "Ringvägen 132, 432 52",
                    Date = new DateTimeOffset(2025, 8, 8, 19, 0, 0, TimeSpan.Zero),
                    Description = "Med slagdängor såsom Gubben & Katten, Tord, Grållen och många många fler ger de oss den mest FORMIDABLA, GENIALA & GRÄNSLÖSASTE SPELNINGEN någonsin på KÄRLEKSPARKEN",
                    Price = 0,
                    TicketUrl = "https://www.instagram.com/karleksparken/",
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

        private async Task SeedSongsAsync(CancellationToken ct)
        {
            var existing = await songRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var songs = new List<Song>
            {
                new() { Title = "Gubben och katten", DurationSeconds = 256, ReleaseDate = new DateTimeOffset(2025, 1, 1, 0, 0, 0, TimeSpan.Zero), LyricsWriter = "Peter Mercury Jonsson", MusicWriter = "Filip B-bender Lennartsson", SpotifyUrl = "https://open.spotify.com/track/4Rz0Fccd0Bmbj7MKJfsHYC?si=33b114794e4b4e86", YoutubeUrl = "https://www.youtube.com/watch?v=TryIrZ2ztP0"  },
                new() { Title = "Grållen", DurationSeconds = 198, ReleaseDate = new DateTimeOffset(2025, 1, 1, 0, 0, 0, TimeSpan.Zero), LyricsWriter = "Filip B-bender Lennartsson", MusicWriter = "SKAV", SpotifyUrl = "https://open.spotify.com/track/4mH1WEPzWN6XgvCo7Qrn8N?si=aa29a20246594341"  },
                new() { Title = "Rädd", DurationSeconds = 181, ReleaseDate = new DateTimeOffset(2025, 1, 1, 0, 0, 0, TimeSpan.Zero), LyricsWriter = "Peter Mercury Jonsson", MusicWriter = "SKAV", SpotifyUrl = "https://open.spotify.com/track/3K2u9hwZDLu70izR34gYF2?si=cbc91e1e050f441c"  },
                new() { Title = "Tord", DurationSeconds = 197, ReleaseDate = new DateTimeOffset(2025, 1, 1, 0, 0, 0, TimeSpan.Zero), LyricsWriter = "Peter Mercury Jonsson", MusicWriter = "SKAV", SpotifyUrl = "https://open.spotify.com/track/1bzNmUgPssLkZPDFMI7Feg?si=50dc48b8149e4119"  },
                new() { Title = "Amerikat", DurationSeconds = 268, ReleaseDate = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero),LyricsWriter = "Filip B-bender Lennartsson", MusicWriter = "SKAV", SpotifyUrl = "https://open.spotify.com/track/2LTBA7hORRIf0V9IQSL1NU?si=122c0b97c54048ef" },
                new() { Title = "Det brinner på sågen", DurationSeconds = 137, ReleaseDate = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero), LyricsWriter = "Filip B-bender Lennartsson", MusicWriter = "SKAV", SpotifyUrl = "https://open.spotify.com/track/4Quz2ID1L3xZtPUfCEPV1L?si=dcaef65519104f0f"  },
                new() { Title = "Duttpenna", DurationSeconds = 193, ReleaseDate = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero), LyricsWriter = "Peter Mercury Jonsson, Filip B-bender Lennartsson", MusicWriter = "SKAV", SpotifyUrl = "https://open.spotify.com/track/1JrHqS1bbLCcxzSygyNPIR?si=fe5b37f871e24ed2"  },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var song in songs)
            {
                AuditHelper.SetCreated(song, null);
                await songRepo.CreateAsync(song, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }
    }
}