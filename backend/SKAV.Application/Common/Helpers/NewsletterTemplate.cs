namespace SKAV.Application.Common.Helpers
{
    public static class NewsletterTemplate
    {
        public static string Build(string subject, string body, string unsubscribeUrl)
        {
            var htmlBody = body
                .Replace("\r\n", "\n")
                .Replace("\n", "<br>");

            return $"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, Helvetica, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:20px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="background-color:#1a1a1a; padding:30px 40px; text-align:center; border-radius:8px 8px 0 0;">
                                        <h1 style="margin:0; font-size:36px; font-weight:bold; color:#ffffff; letter-spacing:4px;">
                                            SKAV
                                        </h1>
                                        <p style="margin:8px 0 0; font-size:12px; color:#aaaaaa; letter-spacing:2px; text-transform:uppercase;">
                                            Nyhetsbrev
                                        </p>
                                    </td>
                                </tr>

                                <!-- Subject -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:30px 40px 10px;">
                                        <h2 style="margin:0; font-size:22px; color:#1a1a1a;">
                                            {subject}
                                        </h2>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:10px 40px 30px;">
                                        <p style="margin:0; font-size:16px; line-height:1.6; color:#333333;">
                                            {htmlBody}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:0 40px;">
                                        <hr style="border:none; border-top:1px solid #eeeeee; margin:0;">
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:20px 40px 30px; text-align:center; border-radius:0 0 8px 8px;">
                                        <p style="margin:0 0 8px; font-size:12px; color:#999999;">
                                            Du får detta mail för att du prenumererar på SKAVs nyhetsbrev.
                                        </p>
                                        <a href="{unsubscribeUrl}" style="font-size:12px; color:#999999; text-decoration:underline;">
                                            Avprenumerera
                                        </a>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """;
        }
    }
}