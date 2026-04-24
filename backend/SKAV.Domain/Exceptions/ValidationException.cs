namespace SKAV.Domain.Exceptions
{
    public class ValidationException : Exception
    {
        public ValidationException(IDictionary<string, string[]> errors)
            : base("One or more validation errors occurred.") => Errors = errors;

        public ValidationException(string parameter, string error)
            : base("One or more validation errors occurred.") =>
                Errors = new Dictionary<string, string[]> { { parameter, [error] } };

        public IDictionary<string, string[]> Errors { get; }
    }
}
