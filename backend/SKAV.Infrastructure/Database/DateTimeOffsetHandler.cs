using Dapper;
using System.Data;

namespace SKAV.Infrastructure.Database
{
    /// <summary>
    /// Needed to handle DateTimeOffset properties in Dapper, since SQLite doesn't have a native DateTimeOffset type.
    /// </summary>
    public class DateTimeOffsetHandler : SqlMapper.TypeHandler<DateTimeOffset>
    {
        public override DateTimeOffset Parse(object value)
        {
            return DateTimeOffset.Parse((string)value);
        }

        public override void SetValue(IDbDataParameter parameter, DateTimeOffset value)
        {
            parameter.Value = value.ToString("o");
        }
    }
}
