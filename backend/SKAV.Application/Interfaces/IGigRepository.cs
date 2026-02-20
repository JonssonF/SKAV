using SKAV.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Interfaces
{
    public interface IGigRepository
    {
            Task<IReadOnlyList<Gig>> GetAllGigsAsync(CancellationToken cancellationToken);
            Task<Gig?> GetGigByIdAsync(int id, CancellationToken cancellationToken);
            Task<int> CreateGigAsync(Gig gig, CancellationToken cancellationToken);
            Task UpdateGigAsync(Gig gig, CancellationToken cancellationToken);
            Task DeleteGigAsync(int id, CancellationToken cancellationToken);
    }
}
