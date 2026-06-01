using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using SKAV.Application.Interfaces;

namespace SKAV.Infrastructure.Services
{
    public class FileUploadService : IFileUploadService
    {
        private const int MaxWidth = 1200;
        private const int MaxHeight = 1200;
        private const int Quality = 75;

        public async Task<string> UploadImageAsync(
            Stream fileStream, string fileName, string folder, CancellationToken ct)
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folder);
            Directory.CreateDirectory(uploadsPath);

            // Läs in filens innehåll för att kunna hasha det
            using var memoryStream = new MemoryStream();
            await fileStream.CopyToAsync(memoryStream, ct);
            var fileBytes = memoryStream.ToArray();

            // Generera filnamn baserat på innehållet — samma bild = samma namn
            var hash = System.Security.Cryptography.SHA256.HashData(fileBytes);
            var uniqueName = $"{Convert.ToHexString(hash).ToLower()}.webp";
            var filePath = Path.Combine(uploadsPath, uniqueName);

            // Om filen redan finns — returnera bara URL:en, ingen dublett
            if (File.Exists(filePath))
                return $"/uploads/{folder}/{uniqueName}";

            // Annars komprimera och spara
            using var image = await Image.LoadAsync(new MemoryStream(fileBytes), ct);
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(MaxWidth, MaxHeight),
                Mode = ResizeMode.Max,
            }));

            await image.SaveAsWebpAsync(filePath, new WebpEncoder { Quality = Quality }, ct);

            return $"/uploads/{folder}/{uniqueName}";
        }
    }
}