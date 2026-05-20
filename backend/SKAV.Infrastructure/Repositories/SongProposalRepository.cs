using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class SongProposalRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<SongProposal>(db, uow), ISongProposalRepository
    {
    }
}