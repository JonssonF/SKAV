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
        IBookingRequestRepository bookingRequestRepo,
        IBookingRecipientRepository bookingRecipientRepo,
        IProductRepository productRepo,
        IProductImageRepository productImageRepo,
        IProductAttributeDefinitionRepository productAttrRepo,
        IProductVariantRepository productVariantRepo,
        IProductOrderRepository productOrderRepo,
        IProductOrderItemRepository productOrderItemRepo,
        IProductOrderRecipientRepository productOrderRecipientRepo,
        IUnitOfWork uow)
    {
        public async Task SeedAsync(CancellationToken ct = default)
        {
            await SeedMembersAsync(ct);
            await SeedGigsAsync(ct);
            await SeedSongsAsync(ct);
            await SeedBookingRequestsAsync(ct);
            await SeedBookingRecipientsAsync(ct);
            await SeedProductsAsync(ct);
            await SeedProductImagesAsync(ct);
            await SeedProductAttributeDefinitionsAsync(ct);
            await SeedProductVariantsAsync(ct);
            await SeedProductOrdersAsync(ct);
            await SeedProductOrderRecipientsAsync(ct);
        }

        private async Task SeedUsersAsync(CancellationToken ct)
        {
            var existing = await memberRepo.GetAllAsync(ct);
            if (existing.Any()) return;
            var admin = new Member
            {
                Name = "Admin",
                Quote = "Jag har full koll på allt!",
                DisplayOrder = 0,
            };
            AuditHelper.SetCreated(admin, null);
            using var scope = uow.BeginTransactionScope();
            await memberRepo.CreateAsync(admin, ct);
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedProductsAsync(CancellationToken ct)
        {
            var existing = await productRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var products = new List<Product>
            {
                new()
                {
                    Title = "SKAV T-shirt",
                    Description = "Klassisk t-shirt med SKAV-logga tryckt på bröstet. 100% bomull.",
                    Price = 249,
                    Category = "Kläder",
                    IsSignable = true,
                    SigningPrice = 50,
                },
                new()
                {
                    Title = "SKAV Hoodie",
                    Description = "Mysig hoodie med SKAV-tryck på ryggen. Perfekt för kalla kvällar.",
                    Price = 449,
                    Category = "Kläder",
                    IsSignable = true,
                    SigningPrice = 50,
                },
                new()
                {
                    Title = "Från Derome med kärlek – Vinyl",
                    Description = "Debutskivan på vinyl. Limiterad upplaga i svart och transparent.",
                    Price = 199,
                    Category = "Musik",
                    IsSignable = true,
                    SigningPrice = 0,
                },
                new()
                {
                    Title = "SKAV Klistermärke",
                    Description = "Tåligt klistermärke med SKAV-logga. Perfekt för gitarrfodralet.",
                    Price = 29,
                    Category = "Övrigt",
                },
                new()
                {
                    Title = "SKAV Keps",
                    Description = "Snapback-keps med broderad SKAV-logga.",
                    Price = 199,
                    Category = "Kläder",
                    IsSignable = true,
                    SigningPrice = 30,
                },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var product in products)
            {
                AuditHelper.SetCreated(product, null);
                await productRepo.CreateAsync(product, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedProductImagesAsync(CancellationToken ct)
        {
            var existing = await productImageRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var images = new List<ProductImage>
            {
                // T-shirt – två bilder
                new() { ProductId = 1, ImageUrl = "/images/products/t-shirt_shop.png", IsPrimary = true, DisplayOrder = 1 },
                new() { ProductId = 1, ImageUrl = "/images/products/t-shirt_back.png", IsPrimary = false, DisplayOrder = 2 },

                // Hoodie – två bilder
                new() { ProductId = 2, ImageUrl = "/images/products/hoodie_svart_shop.png", IsPrimary = true, DisplayOrder = 1 },
                new() { ProductId = 2, ImageUrl = "/images/products/hoodie_back.png", IsPrimary = false, DisplayOrder = 2 },

                // Vinyl
                new() { ProductId = 3, ImageUrl = "/images/products/poster_shop.png", IsPrimary = true, DisplayOrder = 1 },

                // Klistermärke
                new() { ProductId = 4, ImageUrl = "/images/products/stickers_shop.png", IsPrimary = true, DisplayOrder = 1 },

                // Keps
                new() { ProductId = 5, ImageUrl = "/images/products/Keps_shop.png", IsPrimary = true, DisplayOrder = 1 },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var image in images)
            {
                AuditHelper.SetCreated(image, null);
                await productImageRepo.CreateAsync(image, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedProductAttributeDefinitionsAsync(CancellationToken ct)
        {
            var existing = await productAttrRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var definitions = new List<ProductAttributeDefinition>
    {
        // T-shirt – storlek + färg
        new() { ProductId = 1, Name = "Storlek", AttributeValues = "[\"S\",\"M\",\"L\",\"XL\",\"XXL\"]", DisplayOrder = 1 },
        new() { ProductId = 1, Name = "Färg", AttributeValues = "[\"Svart\",\"Vit\"]", DisplayOrder = 2 },

        // Hoodie – storlek + färg
        new() { ProductId = 2, Name = "Storlek", AttributeValues = "[\"S\",\"M\",\"L\",\"XL\"]", DisplayOrder = 1 },
        new() { ProductId = 2, Name = "Färg", AttributeValues = "[\"Svart\",\"Grå\"]", DisplayOrder = 2 },

        // Vinyl – färg
        new() { ProductId = 3, Name = "Färg", AttributeValues = "[\"Svart\",\"Transparent\"]", DisplayOrder = 1 },

        // Keps – färg
        new() { ProductId = 5, Name = "Färg", AttributeValues = "[\"Svart\",\"Grå\",\"Röd\"]", DisplayOrder = 1 },
    };

            using var scope = uow.BeginTransactionScope();
            foreach (var definition in definitions)
            {
                AuditHelper.SetCreated(definition, null);
                await productAttrRepo.CreateAsync(definition, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedProductVariantsAsync(CancellationToken ct)
        {
            var existing = await productVariantRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var variants = new List<ProductVariant>
    {
        // T-shirt varianter
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"S\",\"Färg\":\"Svart\"}", StockQuantity = 5, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"M\",\"Färg\":\"Svart\"}", StockQuantity = 10, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"L\",\"Färg\":\"Svart\"}", StockQuantity = 8, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"XL\",\"Färg\":\"Svart\"}", StockQuantity = 4, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"XXL\",\"Färg\":\"Svart\"}", StockQuantity = 2, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"S\",\"Färg\":\"Vit\"}", StockQuantity = 3, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"M\",\"Färg\":\"Vit\"}", StockQuantity = 7, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"L\",\"Färg\":\"Vit\"}", StockQuantity = 6, Version = 1 },
        new() { ProductId = 1, Attributes = "{\"Storlek\":\"XL\",\"Färg\":\"Vit\"}", StockQuantity = 3, Version = 1 },

        // Hoodie varianter
        new() { ProductId = 2, Attributes = "{\"Storlek\":\"M\",\"Färg\":\"Svart\"}", StockQuantity = 5, Version = 1 },
        new() { ProductId = 2, Attributes = "{\"Storlek\":\"L\",\"Färg\":\"Svart\"}", StockQuantity = 7, Version = 1 },
        new() { ProductId = 2, Attributes = "{\"Storlek\":\"XL\",\"Färg\":\"Svart\"}", StockQuantity = 3, Version = 1 },
        new() { ProductId = 2, Attributes = "{\"Storlek\":\"M\",\"Färg\":\"Grå\"}", StockQuantity = 4, Version = 1 },
        new() { ProductId = 2, Attributes = "{\"Storlek\":\"L\",\"Färg\":\"Grå\"}", StockQuantity = 6, Version = 1 },

        // Vinyl varianter
        new() { ProductId = 3, Attributes = "{\"Färg\":\"Svart\"}", StockQuantity = 20, Version = 1 },
        new() { ProductId = 3, Attributes = "{\"Färg\":\"Transparent\"}", StockQuantity = 10, Version = 1 },

        // Klistermärke – ingen variant, men behöver en för lagersaldo
        new() { ProductId = 4, Attributes = "{}", StockQuantity = 100, Version = 1 },

        // Keps varianter
        new() { ProductId = 5, Attributes = "{\"Färg\":\"Svart\"}", StockQuantity = 8, Version = 1 },
        new() { ProductId = 5, Attributes = "{\"Färg\":\"Grå\"}", StockQuantity = 5, Version = 1 },
        new() { ProductId = 5, Attributes = "{\"Färg\":\"Röd\"}", StockQuantity = 3, Version = 1 },
    };

            using var scope = uow.BeginTransactionScope();
            foreach (var variant in variants)
            {
                AuditHelper.SetCreated(variant, null);
                await productVariantRepo.CreateAsync(variant, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedProductOrdersAsync(CancellationToken ct)
        {
            var existing = await productOrderRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            // Order 1 – ohanterad
            var order1 = new ProductOrder
            {
                Name = "Erik Nilsson",
                Email = "erik.nilsson@example.com",
                Phone = "0701112233",
                Message = "Storlek M på hoodien. Kan jag hämta i Derome?",
                IsHandled = false,
            };

            AuditHelper.SetCreated(order1, null);

            // Order 2 – hanterad
            var order2 = new ProductOrder
            {
                Name = "Sara Lindqvist",
                Email = "sara@example.com",
                Message = "Julklapp till min bror!",
                IsHandled = true,
                HandledAt = new DateTime(2026, 5, 5, 10, 0, 0),
                HandledBy = 1,
            };

            AuditHelper.SetCreated(order2, null);

            using var scope = uow.BeginTransactionScope();

            var order1Id = await productOrderRepo.CreateAsync(order1, ct);
            var order2Id = await productOrderRepo.CreateAsync(order2, ct);

            // Order 1 items – hoodie + klistermärke
            var order1Items = new List<ProductOrderItem>
            {
                new() { ProductOrderId = order1Id, ProductId = 2, ProductVariantId = 10, Quantity = 1 },
                new() { ProductOrderId = order1Id, ProductId = 4, ProductVariantId = 18, Quantity = 3 },
            };

            // Order 2 items – t-shirt + vinyl
            var order2Items = new List<ProductOrderItem>
            {
                new() { ProductOrderId = order2Id, ProductId = 1, ProductVariantId = 2, Quantity = 1 },
                new() { ProductOrderId = order2Id, ProductId = 3, ProductVariantId = 16, Quantity = 1 },
            };

            foreach (var item in order1Items.Concat(order2Items))
            {
                AuditHelper.SetCreated(item, null);
                await productOrderItemRepo.CreateAsync(item, ct);
            }

            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedProductOrderRecipientsAsync(CancellationToken ct)
        {
            var existing = await productOrderRecipientRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var recipients = new List<ProductOrderNotificationRecipient>
            {
                new() { Email = "admin@skav.se", MemberId = 1 },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var recipient in recipients)
            {
                AuditHelper.SetCreated(recipient, null);
                await productOrderRecipientRepo.CreateAsync(recipient, ct);
            }
            await scope.CommitTransactionScopeAsync(ct);
        }

        private async Task SeedMembersAsync(CancellationToken ct)
        {
            var existing = await memberRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var members = new List<Member>
            {
                new() { Name = "Peter Mercury", DisplayOrder = 1 },
                new() { Name = "Ola-La", DisplayOrder = 2 },
                new() { Name = "BP Buk-Pianisten"  , DisplayOrder = 3 },
                new() { Name = "Eddie felspel Linné", DisplayOrder = 4 },
                new() { Name = "Leo Kilimister", DisplayOrder = 5 },
                new() { Name = "B-bender Filip", DisplayOrder = 6 },
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
                // Singlar (inget album)
                new() { Title = "Gubben och katten", DurationSeconds = 256, LyricsWriter = "Peter Mercury Jonsson", MusicWriter = "Filip B-bender Lennartsson" },
                new() { Title = "Tord", DurationSeconds = 197, LyricsWriter = "Peter Mercury Jonsson", MusicWriter = "SKAV" },
                new() { Title = "Det brinner på sågen", DurationSeconds = 137, LyricsWriter = "Filip B-bender Lennartsson", MusicWriter = "SKAV" },
                new() { Title = "Duttpenna", DurationSeconds = 193, LyricsWriter = "Peter Mercury Jonsson, Filip B-bender Lennartsson", MusicWriter = "SKAV" },
                new() { Title = "Grållen", DurationSeconds = 198, LyricsWriter = "Filip B-bender Lennartsson", MusicWriter = "SKAV" },
                new() { Title = "Rädd", DurationSeconds = 181, LyricsWriter = "Peter Mercury Jonsson", MusicWriter = "SKAV" },
                new() { Title = "Amerikat", DurationSeconds = 268, LyricsWriter = "Filip B-bender Lennartsson", MusicWriter = "SKAV" },
            };

            using var scope = uow.BeginTransactionScope();
            foreach (var song in songs)
            {
                AuditHelper.SetCreated(song, null);
                await songRepo.CreateAsync(song, ct);
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