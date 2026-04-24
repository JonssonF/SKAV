using Dapper;
using SKAV.Application.Common.Helpers;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using System.Data;

namespace SKAV.Infrastructure.Database
{
    public class SeedData(
        IMemberRepository memberRepo,
        IGigRepository gigRepo,
        IUnitOfWork uow)
    {
        public async Task SeedAsync(CancellationToken ct = default)
        {
            await SeedMembersAsync(ct);
            await SeedGigsAsync(ct);
        }

        private async Task SeedMembersAsync(CancellationToken ct)
        {
            var existing = await memberRepo.GetAllAsync(ct);
            if (existing.Any()) return;

            var members = new List<Member>
            {
                new() { Name = "Klas", Role = "Sång", Quote = "Jag skriker!", DisplayOrder = 1 },
                new() { Name = "Maja", Role = "Bas", Quote = "Basen dundrar!", DisplayOrder = 2 },
                new() { Name = "Pelle", Role = "Gitarr", DisplayOrder = 3 },
                new() { Name = "Lena", Role = "Trummor", DisplayOrder = 4 },
                new() { Name = "Jonas", Role = "Keyboard", DisplayOrder = 5 }
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
                    Title = "Skavfesten",
                    Location = "Varberg",
                    Adress = "Folkets park",
                    Date = new DateTimeOffset(2026, 6, 15, 20, 0, 0, TimeSpan.Zero),
                    Description = "Stor fest",
                    Price = 150,
                    Notes = "Fri entré före 21",
                },
                new()
                {
                    Title = "Byfesten",
                    Location = "Tvååker",
                    Adress = "Torget",
                    Date = new DateTimeOffset(2026, 7, 1, 19, 0, 0, TimeSpan.Zero),
                    Description = "Live på torget",
                    Price = 0,
                    Notes = "Ta med egen stol"
                },
                new()
                {
                    Title = "Privat Gig",
                    Location = "Himle",
                    Adress = "Bygdegården",
                    Date = new DateTimeOffset(2026, 8, 10, 21, 0, 0, TimeSpan.Zero),
                    Description = "Företagsevent",
                    Price = 0,
                    Notes = "Endast inbjudna"
                }
            };

            using var scope = uow.BeginTransactionScope();

            foreach (var gig in gigs)
            {
                AuditHelper.SetCreated(gig, null);
                await gigRepo.CreateAsync(gig, ct);
            }

            await scope.CommitTransactionScopeAsync(ct);
        }
    }
}