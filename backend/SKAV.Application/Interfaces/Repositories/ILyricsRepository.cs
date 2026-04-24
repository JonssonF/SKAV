using SKAV.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ILyricsRepository : IRepository<Lyrics>
    {
        Task<Lyrics?> GetBySongIdAsync(int songId, CancellationToken ct);
        Task<Lyrics?> GetBySlugAsync(string slug, CancellationToken ct);
    }
}
