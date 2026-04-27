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
        IInstrumentRepository intrumentRepo,
        IMemberInstrumentRepository memberInstrumentRepo,
        IUnitOfWork uow)
    {
        public async Task SeedAsync(CancellationToken ct = default)
        {
            await SeedMembersAsync(ct);
            await SeedGigsAsync(ct);
        }

        public async Task SeedAsync(CancellationToken ct = default)
        {
            await SeedInstrumentsAsync(ct);
            await SeedMembersAsync(ct);
            await SeedMemberInstrumentsAsync(ct);
            await SeedGigsAsync(ct);
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
                new() { Name = "Keyboard", Description = "Synthesizer" }
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
                new() { Name = "Pelle", DisplayOrder = 3 },
                new() { Name = "Lena", DisplayOrder = 4 },
                new() { Name = "Jonas", DisplayOrder = 5 }
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
                new() { MemberId = 1, InstrumentId = 1 },
                new() { MemberId = 2, InstrumentId = 2 },
                new() { MemberId = 3, InstrumentId = 3 },
                new() { MemberId = 4, InstrumentId = 4 },
                new() { MemberId = 5, InstrumentId = 5 }
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