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

        // Subscribers
        public const string SubscriberNotFound = "SubscriberNotFound";

        // Albums, Songs, Lyrics
        public const string AlbumNotFound = "AlbumNotFound";
        public const string SongNotFound = "SongNotFound";
        public const string LyricsNotFound = "LyricsNotFound";
        public const string LyricsAlreadyExists = "LyricsAlreadyExists";

        // Validation
        public const string ValidationFailed = "ValidationFailed";
    }
}
