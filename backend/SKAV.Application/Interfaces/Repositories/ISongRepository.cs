using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ISongRepository : IRepository<Song>
    {
        Task<IEnumerable<Song>> GetByAlbumIdAsync(int albumId, CancellationToken ct);
    }
}
