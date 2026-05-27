namespace SKAV.Application.Common.Helpers
{
    public static class NewsletterTemplate
    {
        public static string Build(string subject, string body, string unsubscribeUrl, string siteUrl)
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
            <body style="margin:0; padding:0; background-color:#f2f2f2; font-family:Arial, Helvetica, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f2f2; padding:30px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                                
                                <!-- Header med logga -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:30px 40px 20px; text-align:center; border-bottom:2px solid #e8e8e8;">
                                        <a href="{siteUrl}" style="text-decoration:none;">
                                            <img src="{siteUrl}/images/skav-logo.png" alt="SKAV" width="220" style="max-width:220px; height:auto; display:block; margin:0 auto;" />
                                        </a>
                                    </td>
                                </tr>

                                <!-- Ämne -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:30px 40px 10px; text-align:center;">
                                        <h1 style="margin:0; font-size:24px; font-weight:bold; color:#1a1a1a; line-height:1.3;">
                                            {subject}
                                        </h1>
                                    </td>
                                </tr>

                                <!-- Innehåll -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:15px 40px 30px;">
                                        <p style="margin:0; font-size:16px; line-height:1.7; color:#333333; text-align:left;">
                                            {htmlBody}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Knappar -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:10px 40px 30px; text-align:center;">
                                        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                                            <tr>
                                                <td style="padding:0 6px;">
                                                    <a href="{siteUrl}" style="display:inline-block; padding:10px 20px; background-color:#c41e1e; color:#ffffff; text-decoration:none; border-radius:6px; font-size:14px; font-weight:bold;">
                                                        Hemsidan
                                                    </a>
                                                </td>
                                                <td style="padding:0 6px;">
                                                    <a href="{siteUrl}/shop" style="display:inline-block; padding:10px 20px; background-color:#1a1a1a; color:#ffffff; text-decoration:none; border-radius:6px; font-size:14px; font-weight:bold;">
                                                        Webshop
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:0 40px;">
                                        <hr style="border:none; border-top:1px solid #e8e8e8; margin:0;">
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color:#ffffff; padding:25px 40px; text-align:center;">
                                        <!-- Instagram -->
                                        <a href="https://www.instagram.com/skav.bandet/" style="text-decoration:none; margin:0 8px;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="28" height="28" style="display:inline-block;" />
                                        </a>

                                        <p style="margin:15px 0 8px; font-size:12px; color:#999999;">
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