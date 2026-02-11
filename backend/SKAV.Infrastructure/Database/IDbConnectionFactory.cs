using System.Data;

namespace SKAV.Infrastructure.Database
{
    public interface IDbConnectionFactory
    {
        /// <summary>
        /// Creates a new database connection.
        /// </summary>
        /// <returns>A new instance of a database connection.</returns>
        IDbConnection CreateConnection();
    }
}
