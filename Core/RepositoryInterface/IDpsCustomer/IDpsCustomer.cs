using Core.DomainModel.DpsCustomer;
using System.Collections.Generic;
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

        /// <summary>
        /// Save New Customer and return Vat Number if opration is success.
        /// </summary>
        /// <param name="dpsCustomer"></param>
        /// <returns></returns>
        Task<string> AddNewCustomerAsync(DpsCustomer dpsCustomer);

        Task<bool> UpdateCustomerAsync(DpsCustomer dpsCustomer);

        Task<List<DpsCustomer>> GetAllCustomersAsync();
    }
}