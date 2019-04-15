using Core.DomainModel.DpsCustomer;
using Core.ServicesInterface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ServicesImplementation
{

    public class SiIBrightStaffing : IBrightStaffing
    {
        public Task<int> AddCustomerToBS(DpsCustomer customer)
        {
            throw new NotImplementedException();
        }
    }
}
