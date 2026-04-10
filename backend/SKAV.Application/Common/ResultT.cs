using SKAV.Application.Validator;

namespace SKAV.Application.Common
{
    public class Result<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public List<ValidationError>? Errors { get; set; }

        public static Result<T> Ok(T data) =>
            new() { Success = true, Data = data };

        public static Result<T> Fail(List<ValidationError> errors) =>
            new() { Success = false, Errors = errors };
    }
}
