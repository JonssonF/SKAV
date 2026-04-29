using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface ISongRepository : IRepository<Song>
    {
        Task<IEnumerable<Song>> GetByAlbumIdAsync(int albumId, CancellationToken ct);
        Task<bool> ExistsByTitleAndAlbumAsync(string title, int? albumId, int? excludeId, CancellationToken ct);
        Task<bool> ExistsByTrackNumberAndAlbumAsync(int? trackNumber, int? albumId, int? excludeId, CancellationToken ct);
    }
}
