using SKAV.Application.Validator;

namespace SKAV.Application.Common
{
    public class Result
    {
        public bool Success { get; set; }

        public List<ValidationError>? Errors { get; set; }

        public static Result Ok() => new() { Success = true };

        public static Result Fail(List<ValidationError> errors) =>
            new() { Success = false, Errors = errors };
    }
}
