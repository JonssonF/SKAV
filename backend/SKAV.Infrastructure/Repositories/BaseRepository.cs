using Dapper;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Attributes;
using SKAV.Domain.Entities;
using SKAV.Infrastructure.Database;
using System.Reflection;

namespace SKAV.Infrastructure.Repositories
{
    public abstract class BaseRepository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly IDbConnectionFactory Db;
        protected readonly IUnitOfWorkConnection Uow;
        protected static readonly string TableName = GetTableName();

        protected BaseRepository(IDbConnectionFactory db, IUnitOfWorkConnection uow)
        {
            Db = db;
            Uow = uow;
        }

        private static string GetTableName()
        {
            var attribute = typeof(T).GetCustomAttribute<TableNameAttribute>()
                ?? throw new InvalidOperationException(
                    $"Entity {typeof(T).Name} saknar [TableName] attribut.");
            return attribute.Name;
        }

        public async Task<T?> GetByIdAsync(int id, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            var sql = $"SELECT * FROM {TableName} WHERE Id = @Id AND DeletedAt IS NULL LIMIT 1;";

            return await conn.QuerySingleOrDefaultAsync<T>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                cancellationToken: ct));
        }

        public async Task<IEnumerable<T>> GetAllAsync(CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            var sql = $"SELECT * FROM {TableName} WHERE DeletedAt IS NULL;";

            return await conn.QueryAsync<T>(new CommandDefinition(
                commandText: sql,
                cancellationToken: ct));
        }

        public async Task<bool> ExistsAsync(int id, CancellationToken ct)
        {
            using var conn = Db.CreateConnection();
            conn.Open();

            var sql = $"SELECT COUNT(1) FROM {TableName} WHERE Id = @Id AND DeletedAt IS NULL;";

            return await conn.ExecuteScalarAsync<int>(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id },
                cancellationToken: ct)) > 0;
        }

        public async Task<int> CreateAsync(T entity, CancellationToken ct)
        {
            var properties = GetInsertProperties();
            var columns = string.Join(", ", properties);
            var parameters = string.Join(", ", properties.Select(p => $"@{p}"));

            var sql = $"""
                INSERT INTO {TableName} ({columns})
                VALUES ({parameters});
                SELECT last_insert_rowid();
                """;

            return (int)await Uow.Connection.ExecuteScalarAsync<long>(new CommandDefinition(
                commandText: sql,
                parameters: entity,
                transaction: Uow.Transaction,
                cancellationToken: ct));
        }

        public async Task UpdateAsync(T entity, CancellationToken ct)
        {
            var properties = GetUpdateProperties();
            var setClause = string.Join(", ", properties.Select(p => $"{p} = @{p}"));

            var sql = $"""
                UPDATE {TableName}
                SET {setClause}
                WHERE Id = @Id AND DeletedAt IS NULL;
                """;

            var affected = await Uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: entity,
                transaction: Uow.Transaction,
                cancellationToken: ct));

            if (affected == 0)
                throw new KeyNotFoundException($"{typeof(T).Name} with id {entity.Id} not found.");
        }

        public async Task DeleteAsync(int id, T entity, CancellationToken ct)
        {
            var sql = $"""
                UPDATE {TableName}
                SET DeletedAt = @DeletedAt, DeletedBy = @DeletedBy
                WHERE Id = @Id AND DeletedAt IS NULL;
                """;

            var affected = await Uow.Connection.ExecuteAsync(new CommandDefinition(
                commandText: sql,
                parameters: new { Id = id, entity.DeletedAt, entity.DeletedBy },
                transaction: Uow.Transaction,
                cancellationToken: ct));

            if (affected == 0)
                throw new KeyNotFoundException($"{typeof(T).Name} with id {id} not found.");
        }

        private static List<string> GetInsertProperties() =>
            typeof(T).GetProperties()
                .Where(p =>
                    p.Name is not "Id" and not "UpdatedAt" and not "UpdatedBy" and not "DeletedAt" and not "DeletedBy"
                    && (p.PropertyType.IsPrimitive
                        || p.PropertyType == typeof(string)
                        || p.PropertyType == typeof(DateTime)
                        || p.PropertyType == typeof(DateTime?)
                        || p.PropertyType == typeof(DateTimeOffset)
                        || p.PropertyType == typeof(DateTimeOffset?)
                        || p.PropertyType.IsValueType))
                .Select(p => p.Name)
                .ToList();

        private static List<string> GetUpdateProperties() =>
            typeof(T).GetProperties()
                .Where(p =>
                    p.Name is not "Id" and not "CreatedAt" and not "CreatedBy" and not "DeletedAt" and not "DeletedBy"
                    && (p.PropertyType.IsPrimitive
                        || p.PropertyType == typeof(string)
                        || p.PropertyType == typeof(DateTime)
                        || p.PropertyType == typeof(DateTime?)
                        || p.PropertyType == typeof(DateTimeOffset)
                        || p.PropertyType == typeof(DateTimeOffset?)
                        || p.PropertyType.IsValueType))
                .Select(p => p.Name)
                .ToList();
    }
}
