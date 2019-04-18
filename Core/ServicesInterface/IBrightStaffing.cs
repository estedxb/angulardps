using Core.DomainModel.DpsCustomer;

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