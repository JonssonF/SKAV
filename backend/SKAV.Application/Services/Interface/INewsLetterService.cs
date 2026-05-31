using SKAV.Application.DTOs.Newsletter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Services.Interface
{
    public interface INewsletterService
    {
        Task<SendNewsletterResponseDto> SendAsync(SendNewsletterRequestDto request, CancellationToken ct);
        PreviewNewsletterResponseDto Preview(PreviewNewsletterRequestDto request);

    }
}
