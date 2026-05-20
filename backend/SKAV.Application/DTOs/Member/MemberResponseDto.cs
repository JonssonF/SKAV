namespace SKAV.Application.DTOs.Member
{
    public class MemberResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Role { get; set; }
        public string? Bio { get; set; }
        public string? Quote { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }
}