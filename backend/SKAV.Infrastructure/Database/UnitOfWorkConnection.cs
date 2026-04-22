using SKAV.Application.Interfaces;
using SKAV.Infrastructure.Database;
using System.Data;
using System.Data.Common;

public class UnitOfWorkConnection : IUnitOfWorkConnection
{
    private readonly IDbConnectionFactory _factory;

    public IDbConnection Connection { get; private set; } = null!;
    public IDbTransaction? Transaction { get; private set; }

    public UnitOfWorkConnection(IDbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken)
    {
        Connection = _factory.CreateConnection();

        if (Connection is DbConnection dbConn)
            await dbConn.OpenAsync(cancellationToken);
        else
            Connection.Open();

        Transaction = Connection.BeginTransaction();
    }

    public Task CommitAsync()
    {
        Transaction?.Commit();
        Dispose();
        return Task.CompletedTask;
    }

    public Task RollbackAsync()
    {
        Transaction?.Rollback();
        Dispose();
        return Task.CompletedTask;
    }

    private void Dispose()
    {
        Transaction?.Dispose();
        Connection?.Dispose();
    }
}