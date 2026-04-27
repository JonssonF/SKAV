using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class InstrumentRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        : BaseRepository<Instrument>(db, uow), IInstrumentRepository
    {

    }

}

