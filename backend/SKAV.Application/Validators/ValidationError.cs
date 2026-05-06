namespace SKAV.Application.Validator
{
    public class ValidationError
    {
        public string Field { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? Code { get; set; }
    }
}
