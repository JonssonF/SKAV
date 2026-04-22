using SKAV.Infrastructure.Database;
using System.Data;
using System.Data.Common;

namespace SKAV.Infrastructure.Repositories
{
    public class UserRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public UserRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        private async Task<IDbConnection> OpenAsync(CancellationToken ct)
        {
            var conn = _connectionFactory.CreateConnection();
            if (conn is DbConnection dbConn)
                await dbConn.OpenAsync(ct);
            else
                conn.Open();
            return conn;
        }


    }
}
