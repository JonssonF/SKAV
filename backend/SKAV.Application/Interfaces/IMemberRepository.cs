using SKAV.Domain.Models;

namespace SKAV.Application.Interfaces
{
    public interface IMemberRepository
    {
        Task<IEnumerable<Member>> GetAllAsync(CancellationToken ct);
        Task<Member?> GetByIdAsync(int id, CancellationToken ct);
        Task<int> CreateAsync(Member member, CancellationToken ct);
        Task UpdateAsync(Member member, CancellationToken ct);
        Task DeleteAsync(int id, CancellationToken ct);
    }
}
