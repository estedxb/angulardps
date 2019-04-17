using Core.DomainModel.DpsCustomer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.ServicesInterface
{
    public interface IBrightStaffing
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        int AddCustomerToBS(DpsCustomer customer);

       

       
    }
}
