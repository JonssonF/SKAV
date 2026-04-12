namespace SKAV.Domain.Models
{
    public class Member
    {
        public int Id { get; set; }
        //Mandatory fields
        public required string Name { get; set; }
        public required string Role { get; set; }
        //Optional fields
        public string? Quote { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }
}