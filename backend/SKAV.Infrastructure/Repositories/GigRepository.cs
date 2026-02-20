using SKAV.Application.Interfaces;
using SKAV.Domain.Models;
using SKAV.Infrastructure.Database;

namespace SKAV.Infrastructure.Repositories
{
    public sealed class GigRepository : IGigRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public GigRepository(IDbConnectionFactory connectionFactory) => _connectionFactory = connectionFactory;

        public Task AddGigAsync(Gig gig, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task DeleteGigAsync(int id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Gig>> GetAllGigsAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<Gig> GetGigByIdAsync(int id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task UpdateGigAsync(Gig gig, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
