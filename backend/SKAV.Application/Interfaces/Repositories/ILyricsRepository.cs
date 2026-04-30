using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ILyricsRepository : IRepository<Lyrics>
    {
        Task<Lyrics?> GetBySongIdAsync(int songId, CancellationToken ct);
        Task<Lyrics?> GetBySlugAsync(string slug, CancellationToken ct);
    }
}
