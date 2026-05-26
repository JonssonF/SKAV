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
            // Skapa mapp om den inte finns
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folder);
            Directory.CreateDirectory(uploadsPath);

            // Generera unikt filnamn (behåll inte originalnamnet – undvik konflikter)
            var uniqueName = $"{Guid.NewGuid()}.webp";
            var filePath = Path.Combine(uploadsPath, uniqueName);

            // Ladda bilden med ImageSharp (stöder JPEG, PNG, GIF, BMP, TIFF, WebP)
            using var image = await Image.LoadAsync(fileStream, ct);

            // Skala ner om bilden är för stor, behåll proportioner
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(MaxWidth, MaxHeight),
                Mode = ResizeMode.Max,
            }));

            await image.SaveAsWebpAsync(filePath, new WebpEncoder { Quality = Quality }, ct);

            // Returnera relativ sökväg för databasen
            return $"/uploads/{folder}/{uniqueName}";
        }
    }
}