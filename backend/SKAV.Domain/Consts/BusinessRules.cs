namespace SKAV.Domain.Consts
{
    public static class BusinessRules
    {
        // Auth
        public const string InvalidCredentials = "InvalidCredentials";
        public const string EmailAlreadyExists = "EmailAlreadyExists";
        public const string UserNotFound = "UserNotFound";
        public const string InvalidPassword = "InvalidPassword";
        public const string InvalidRole = "InvalidRole";

        // Gigs
        public const string GigNotFound = "GigNotFound";
        public const string GigAlreadyExists = "GigAlreadyExists";

        // Members
        public const string MemberNotFound = "MemberNotFound";

        // Validation
        public const string ValidationFailed = "ValidationFailed";
    }
}
