using SKAV.Application.Common;
using SKAV.Application.DTOs.Member;
using SKAV.Application.Interfaces;
using SKAV.Application.Services.Interface;
using SKAV.Application.Validator;
using SKAV.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _repo;

        public MemberService(IMemberRepository repo)
        {
            _repo = repo;
        }

        public async Task<Result<IEnumerable<MemberResponseDto>>> GetAllAsync(CancellationToken ct)
        {
            var members = await _repo.GetAllAsync(ct);

            var result = members
                .OrderBy(m => m.DisplayOrder)
                .Select(MapToDto);

            return Result<IEnumerable<MemberResponseDto>>.Ok(result);
        }

        public async Task<Result<MemberResponseDto>> GetByIdAsync(int id, CancellationToken ct)
        {
            var member = await _repo.GetByIdAsync(id, ct);

            if (member is null)
            {
                return Result<MemberResponseDto>.Fail(new()
            {
                new ValidationError
                {
                    Field = "Id",
                    Message = "Bandmedlem hittades inte",
                    Code = "NotFound"
                }
            });
            }

            return Result<MemberResponseDto>.Ok(MapToDto(member));
        }

        public async Task<Result<int>> CreateAsync(CreateMemberRequestDto request, CancellationToken ct)
        {
            var member = new Member
            {
                Name = request.Name,
                Role = request.Role,
                Quote = request.Quote,
                ImageUrl = request.ImageUrl,
                DisplayOrder = request.DisplayOrder
            };

            var id = await _repo.CreateAsync(member, ct);

            return Result<int>.Ok(id);
        }

        public async Task<Result> UpdateAsync(int id, CreateMemberRequestDto request, CancellationToken ct)
        {
            var existing = await _repo.GetByIdAsync(id, ct);

            if (existing is null)
            {
                return Result.Fail(new()
            {
                new ValidationError
                {
                    Field = "Id",
                    Message = "Bandmedlem hittades inte",
                    Code = "NotFound"
                }
            });
            }

            existing.Name = request.Name;
            existing.Role = request.Role;
            existing.Quote = request.Quote;
            existing.ImageUrl = request.ImageUrl;
            existing.DisplayOrder = request.DisplayOrder;

            await _repo.UpdateAsync(existing, ct);

            return Result.Ok();
        }

        public async Task<Result> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await _repo.GetByIdAsync(id, ct);

            if (existing is null)
            {
                return Result.Fail(new()
            {
                new ValidationError
                {
                    Field = "Id",
                    Message = "Bandmedlem hittades inte",
                    Code = "NotFound"
                }
            });
            }

            await _repo.DeleteAsync(id, ct);

            return Result.Ok();
        }

        private static MemberResponseDto MapToDto(Member m) => new()
        {
            Id = m.Id,
            Name = m.Name,
            Role = m.Role,
            Quote = m.Quote,
            ImageUrl = m.ImageUrl,
            DisplayOrder = m.DisplayOrder
        };
    }
}
