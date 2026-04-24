using SKAV.Application.DTOs.Subscriber;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Services.Interface
{
    public interface ISubscriberService
    {
        Task<SubscribeResponseDto> SubscribeAsync(SubscribeRequestDto request, CancellationToken ct);
        Task<UnsubscribeResponseDto> UnsubscribeAsync(SubscribeRequestDto request, CancellationToken ct);
    }
}
