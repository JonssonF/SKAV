using System.Data;

namespace SKAV.Application.Interfaces
{
    public interface IUnitOfWorkConnection
    {
        IDbConnection Connection { get; }
        IDbTransaction? Transaction { get; }

        Task BeginTransactionAsync(CancellationToken ct);
        Task CommitAsync();
        Task RollbackAsync();
    }
}
