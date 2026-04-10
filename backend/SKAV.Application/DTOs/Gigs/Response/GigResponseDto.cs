using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.DTOs.Gigs.Response
{
    public class GigResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Location { get; set; } = null!;
        public DateTimeOffset Date { get; set; }
        public decimal? Price { get; set; }
        public string? Notes { get; set; }
        public string? TicketUrl { get; set; }
    }
}
