using SKAV.Application.Interfaces.UoW;
using System.Data.Common;

namespace SKAV.Infrastructure.Database.UoW
{
    public sealed class UnitOfWork : IUnitOfWork, IUnitOfWorkConnection, IDisposable
    {
        private readonly IDbConnectionFactory _factory;
        private DbConnection? _connection;

        public UnitOfWork(IDbConnectionFactory factory)
        {
            _factory = factory;
        }

        public DbConnection Connection
        {
            get
            {
                if (_connection == null)
                {
                    _connection = (DbConnection)_factory.CreateConnection();
                    _connection.Open();
                }
                return _connection;
            }
        }

        public DbTransaction? Transaction { get; private set; }

        public ITransactionScope BeginTransactionScope()
        {
            if (Transaction != null)
                return new NestedTransactionScope(this);

            Transaction = Connection.BeginTransaction();
            return new RootTransactionScope(this);
        }

        private async Task CommitCoreAsync(CancellationToken cancellationToken)
        {
            DbTransaction tx = Transaction ?? throw new InvalidOperationException("No active transaction.");
            try
            {
                await tx.CommitAsync(cancellationToken);
            }
            finally
            {
                await tx.DisposeAsync();
                Transaction = null;
            }
        }

        private void RollbackCore()
        {
            if (Transaction is null) return;
            try
            {
                Transaction.Rollback();
            }
            catch { /* redan avslutad */ }
            finally
            {
                Transaction.Dispose();
                Transaction = null;
            }
        }

        public void Dispose()
        {
            if (Transaction is not null)
                RollbackCore();

            _connection?.Dispose();
        }

        private sealed class RootTransactionScope(UnitOfWork owner) : ITransactionScope
        {
            private bool _committed;

            public async Task CommitTransactionScopeAsync(CancellationToken cancellationToken = default)
            {
                await owner.CommitCoreAsync(cancellationToken);
                _committed = true;
            }

            public void Dispose()
            {
                if (!_committed)
                    owner.RollbackCore();
            }
        }

        private sealed class NestedTransactionScope(UnitOfWork owner) : ITransactionScope
        {
            private bool _committed;

            public Task CommitTransactionScopeAsync(CancellationToken cancellationToken = default)
            {
                _committed = true;
                return Task.CompletedTask;
            }

            public void Dispose()
            {
                if (!_committed)
                    owner.RollbackCore();
            }
        }
    }
}