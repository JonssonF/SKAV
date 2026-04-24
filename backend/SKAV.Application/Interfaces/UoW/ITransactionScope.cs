namespace SKAV.Application.Interfaces.UoW
{
    public interface ITransactionScope : IDisposable
    {
        Task CommitTransactionScopeAsync(CancellationToken cancellationToken = default);
    }
}
