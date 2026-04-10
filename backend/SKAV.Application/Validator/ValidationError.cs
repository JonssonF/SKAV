using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Validator
{
    public class ValidationError
    {
        public string Field { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? Code { get; set; }
    }
}
