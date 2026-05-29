using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SKAV.Application.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SKAV.Api.Controllers
{
    [Route("api/upload")]
    [ApiController]
    [Authorize(Roles = "Admin,Editor")]
    public class UploadController(IFileUploadService uploadService) : ControllerBase
    {
        private static readonly string[] s_allowedExtensions =
            [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

        private const long MaxFileSize = 10 * 1024 * 1024; // 10 MB

        [HttpPost("{folder}")]
        [SwaggerOperation("Ladda upp en bild till angiven mapp (products, members, albums, songs)")]
        public async Task<UploadResponseDto> Upload(
            string folder, IFormFile file, CancellationToken ct)
        {
            // Validera mapp
            var allowedFolders = new[] { "products", "members", "albums", "songs" }; if (!allowedFolders.Contains(folder.ToLower()))
                return new UploadResponseDto { Error = "Ogiltig mapp." };

            // Validera fil
            if (file.Length == 0)
                return new UploadResponseDto { Error = "Ingen fil vald." };

            if (file.Length > MaxFileSize)
                return new UploadResponseDto { Error = "Filen är för stor. Max 10 MB." };

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!s_allowedExtensions.Contains(extension))
                return new UploadResponseDto { Error = "Ogiltigt filformat. Tillåtna: JPG, PNG, GIF, WebP, BMP." };

            // Ladda upp och komprimera
            using var stream = file.OpenReadStream();
            var path = await uploadService.UploadImageAsync(stream, file.FileName, folder.ToLower(), ct);

            return new UploadResponseDto { Url = path };
        }
    }

    public class UploadResponseDto
    {
        public string? Url { get; init; }
        public string? Error { get; init; }
    }
}