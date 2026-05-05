namespace SKAV.Domain.Consts
{
    public static class BusinessRules
    {
        // General
        public const string Forbidden = "Forbidden";

        // Auth
        public const string InvalidCredentials = "InvalidCredentials";
        public const string EmailAlreadyExists = "EmailAlreadyExists";
        public const string UserNotFound = "UserNotFound";
        public const string InvalidPassword = "InvalidPassword";
        public const string InvalidRole = "InvalidRole";

        // Album
        public const string AlbumNotFound = "AlbumNotFound";
        public const string AlbumAlreadyExists = "AlbumAlreadyExists";

        // Booking
        public const string BookingRequestNotFound = "BookingRequestNotFound";
        public const string BookingRecipientNotFound = "BookingRecipientNotFound";
        public const string BookingRecipientAlreadyExists = "BookingRecipientAlreadyExists";

        // Gigs
        public const string GigNotFound = "GigNotFound";
        public const string GigAlreadyExists = "GigAlreadyExists";

        // Members
        public const string MemberNotFound = "MemberNotFound";
        public const string MemberAlreadyExists = "MemberAlreadyExists";
        public const string MemberDisplayOrderExists = "MemberDisplayOrderExists";

        // Instruments
        public const string InstrumentNotFound = "InstrumentNotFound";
        public const string InstrumentAlreadyExists = "InstrumentAlreadyExists";
        public const string MemberInstrumentNotFound = "MemberInstrumentNotFound";

        // Subscribers
        public const string SubscriberNotFound = "SubscriberNotFound";

        // Songs
        public const string SongNotFound = "SongNotFound";
        public const string SongAlreadyExists = "SongAlreadyExists";

        // Lyrics
        public const string LyricsNotFound = "LyricsNotFound";
        public const string LyricsAlreadyExists = "LyricsAlreadyExists";

        // Newsletter
        public const string NoSubscribers = "NoSubscribers";

        // Validation
        public const string ValidationFailed = "ValidationFailed";
    }
}