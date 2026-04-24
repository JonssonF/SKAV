using SKAV.Domain.Entities;

namespace SKAV.Application.Interfaces.Repositories
{
    public interface IMemberRepository
    {
        Task<IEnumerable<Member>> GetAllAsync(CancellationToken ct);
        Task<Member?> GetByIdAsync(int id, CancellationToken ct);
        Task<int> CreateAsync(Member member, CancellationToken ct);
        Task UpdateAsync(Member member, CancellationToken ct);
        Task DeleteAsync(int id, Member member, CancellationToken ct);
    }
}
