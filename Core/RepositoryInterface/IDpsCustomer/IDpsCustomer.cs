using Core.DomainModel.DpsCustomer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.RepositoryInterface.IDpsCustomer
{
    public interface IDpsCustomer
    {
        /// <summary>
        /// Get Customer By Vat Number, Vat Number is ID 
        /// </summary>
        /// <param name="VatNumber"></param>
        /// <returns></returns>
        Task<DpsCustomer> GetCustomerByVatNumberAsync(string VatNumber);


    }
}
