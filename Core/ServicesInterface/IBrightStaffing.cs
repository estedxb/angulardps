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
        /// Get Customer By Vat Number, Vat Number is ID 
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        Task<int> AddCustomerToBS(DpsCustomer customer);


    }
}
