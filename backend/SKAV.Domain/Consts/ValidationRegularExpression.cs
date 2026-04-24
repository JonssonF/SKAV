namespace SKAV.Domain.Consts
{
    public static class ValidationRegularExpression
    {
        /// <summary>
        /// Tillåter bokstäver, siffror, mellanslag och vanliga skiljetecken.
        /// Passar för titlar, beskrivningar, noteringar etc.
        /// </summary>
        public const string GeneralText = @"^[\p{L}0-9\s\.\,\!\?\-:()']*$";

        /// <summary>
        /// Tillåter bokstäver, siffror, mellanslag, punkt, komma och bindestreck.
        /// Passar för namn på personer och band.
        /// </summary>
        public const string Name = @"^[\p{L}\s\.\-']*$";

        /// <summary>
        /// Tillåter bokstäver, siffror, mellanslag, punkt, komma och bindestreck.
        /// Passar för gatuadresser.
        /// </summary>
        public const string Address = @"^[\p{L}0-9\s\.\,\-]*$";

        /// <summary>
        /// Tillåter bokstäver och mellanslag.
        /// Passar för ortsnamn och länder.
        /// </summary>
        public const string City = @"^[\p{L}\s\-]*$";

        /// <summary>
        /// Tillåter 5 siffror, med eller utan mellanslag.
        /// Passar för svenska postnummer ex. 123 45 eller 12345.
        /// </summary>
        public const string PostalCode = @"^\d{3}\s?\d{2}$";

        /// <summary>
        /// Enkel e-postvalidering.
        /// </summary>
        public const string Email = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

        /// <summary>
        /// Tillåter http och https URL:er.
        /// Passar för biljettlänkar och andra externa URL:er.
        /// </summary>
        public const string Url = @"^https?://[^\s/$.?#].[^\s]*$";

        /// <summary>
        /// Tillåter bokstäver, siffror, mellanslag och vanliga skiljetecken.
        /// Passar för roller i ett band ex. Gitarrist, Trummis etc.
        /// </summary>
        public const string Role = @"^[\p{L}0-9\s\-\/]*$";

        /// <summary>
        /// Tillåter bokstäver, siffror, mellanslag och de flesta skiljetecken.
        /// Passar för längre fritext som citat och beskrivningar.
        /// </summary>
        public const string FreeText = @"^[\p{L}0-9\s\.\,\!\?\-:()'""]*$";

        /// <summary>
        /// Kräver minst 8 tecken, minst en bokstav, minst en siffra och specialtecken.
        /// </summary>
        public const string Password = @"^(?=.*[\p{L}])(?=.*\d)(?=.*[@$!%*?&\-_#])[^\s]{8,}$";
    }
}
