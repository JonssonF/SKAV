namespace SKAV.Application.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadImageAsync(Stream fileStream, string fileName, string folder, CancellationToken ct);
    }
}