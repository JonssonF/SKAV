using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IAlbumRepository : IRepository<Album>
    {
        Task<bool> ExistsByTitleAsync(string title, int? excludeId, CancellationToken ct);
    }
}
