using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Domain.Exceptions
{
    public static class ExceptionHelper
    {
        public static bool IsFatal(Exception ex) =>
            ex is OutOfMemoryException
                or StackOverflowException
                or AccessViolationException;
    }
}
