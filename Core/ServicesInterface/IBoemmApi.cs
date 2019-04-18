using BoemmValueObjects;
using System.Threading.Tasks;

namespace Core.ServicesInterface
{
    public interface IBoemmApi
    {
        /// <summary>
        /// Get Customer from Boemm Master DB.
        /// </summary>
        /// <param name="VatNumber"></param>
        /// <returns></returns>
        Task<Customer> GetBoemmCustomerByVatNumberAsync(string VatNumber);

        /// <summary>
        /// Retrurn Cutomer Status: Active/ Pending/ Blocked. Status depands on the credit check.
        /// </summary>
        /// <param name="Customer"></param>
        /// <returns></returns>
        Task<Customer> AddOrUpdateNewCustomerAsync(Customer Customer);
    }
}