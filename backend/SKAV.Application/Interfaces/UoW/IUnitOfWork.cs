using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SKAV.Application.Interfaces.UoW
{
    public interface IUnitOfWork
    {
        ITransactionScope BeginTransactionScope();
    }
}
