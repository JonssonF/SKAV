namespace SKAV.Application.Common.Helpers
{
    public static class NotificationTemplate
    {
        public static string BookingRequest(
            string name, string email, string? phone,
            DateTimeOffset? eventDate, string? eventType,
            string message, string adminUrl)
        {
            var dateText = eventDate.HasValue
                ? eventDate.Value.ToString("yyyy-MM-dd")
                : "Ej angivet";

            return BuildWrapper("Ny bokningsförfrågan", $"""
                <h2 style="margin:0 0 20px; font-size:20px; color:#1a1a1a;">Ny bokningsförfrågan</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                    {Row("Namn", name)}
                    {Row("E-post", $"<a href=\"mailto:{email}\" style=\"color:#c41e1e;\">{email}</a>")}
                    {Row("Telefon", phone ?? "–")}
                    {Row("Eventtyp", eventType ?? "–")}
                    {Row("Önskat datum", dateText)}
                </table>
                <div style="margin:20px 0; padding:15px; background-color:#f9f9f9; border-radius:6px; border-left:3px solid #c41e1e;">
                    <p style="margin:0 0 4px; font-size:12px; color:#999999; text-transform:uppercase;">Meddelande</p>
                    <p style="margin:0; font-size:15px; color:#333333; line-height:1.6;">{message}</p>
                </div>
                {AdminButton("Öppna i admin", adminUrl)}
            """);
        }

        public static string ProductOrder(
            string name, string email, string? phone,
            string? orderMessage, string? address, string? city, string? postalCode,
            List<OrderItemInfo> items, string adminUrl)
        {
            var itemRows = string.Join("", items.Select(i =>
            {
                var signed = i.IsSigned ? " <span style=\"color:#c41e1e; font-weight:bold;\">✍ Signerad</span>" : "";
                var attrs = !string.IsNullOrEmpty(i.Attributes) && i.Attributes != "{}"
                    ? $" <span style=\"color:#999999;\">({i.Attributes})</span>" : "";
                return $"""
                    <tr>
                        <td style="padding:8px 0; border-bottom:1px solid #eeeeee; font-size:14px; color:#333333;">
                            {i.Quantity}x {i.Title}{attrs}{signed}
                        </td>
                    </tr>
                """;
            }));

            var addressText = !string.IsNullOrEmpty(address)
                ? $"{address}, {postalCode} {city}".Trim(' ', ',')
                : "–";

            return BuildWrapper("Ny beställning", $"""
                <h2 style="margin:0 0 20px; font-size:20px; color:#1a1a1a;">Ny beställning</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                    {Row("Namn", name)}
                    {Row("E-post", $"<a href=\"mailto:{email}\" style=\"color:#c41e1e;\">{email}</a>")}
                    {Row("Telefon", phone ?? "–")}
                    {Row("Adress", addressText)}
                </table>
                <div style="margin:20px 0;">
                    <p style="margin:0 0 8px; font-size:12px; color:#999999; text-transform:uppercase;">Produkter</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        {itemRows}
                    </table>
                </div>
                {(string.IsNullOrEmpty(orderMessage) ? "" : $"""
                <div style="margin:0 0 20px; padding:15px; background-color:#f9f9f9; border-radius:6px; border-left:3px solid #c41e1e;">
                    <p style="margin:0 0 4px; font-size:12px; color:#999999; text-transform:uppercase;">Meddelande</p>
                    <p style="margin:0; font-size:15px; color:#333333; line-height:1.6;">{orderMessage}</p>
                </div>
                """)}
                {AdminButton("Öppna i admin", adminUrl)}
            """);
        }

        private static string Row(string label, string value) => $"""
            <tr>
                <td style="padding:6px 0; font-size:13px; color:#999999; width:120px; vertical-align:top;">{label}</td>
                <td style="padding:6px 0; font-size:15px; color:#333333;">{value}</td>
            </tr>
        """;

        private static string AdminButton(string text, string url) => $"""
            <table cellpadding="0" cellspacing="0" style="margin:10px 0;">
                <tr>
                    <td style="border-radius:6px; background-color:#c41e1e;">
                        <a href="{url}" style="display:inline-block; padding:12px 24px; color:#ffffff; text-decoration:none; font-size:14px; font-weight:bold;">
                            {text}
                        </a>
                    </td>
                </tr>
            </table>
        """;

        private static string BuildWrapper(string title, string content) => $"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f2f2f2; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f2f2; padding:30px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                        <tr>
                            <td style="background-color:#ffffff; padding:20px 40px; text-align:center; border-bottom:2px solid #e8e8e8;">
                             <img src="https://skav.nu/images/skav-logo.png" alt="SKAV" width="180" style="max-width:180px; height:auto; display:block; margin:0 auto;" />
                           </td>
                        </tr>
                        <tr>
                            <td style="background-color:#ffffff; padding:30px 40px;">
                                {content}
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#ffffff; padding:0 40px 20px; text-align:center;">
                                <p style="margin:0; font-size:11px; color:#cccccc;">Automatiskt meddelande från skav.nu</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
""";

        public class OrderItemInfo
        {
            public required string Title { get; set; }
            public string? Attributes { get; set; }
            public int Quantity { get; set; }
            public bool IsSigned { get; set; }
        }
    }
}