using Core.DomainModel.DpsCustomerUser;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.RepositoryInterface.IDpsCustomerUser
{
    public interface IDpsUser
    {
        /// <summary>
        /// Get Customer By id,
        /// </summary>
        /// <param name="CustomerVatNumber"></param>
        /// <returns></returns>
        Task<DpsUser> GetUserByCustomerVatNumberAsync(string CustomerVatNumber);

        Task<List<DpsUser>> GetAllUsersAsync();

        /// <summary>
        /// Save New Customer User
        /// </summary>
        /// <param name="dpsCustomer"></param>
        /// <returns></returns>
        Task<string> AddNewUserAsync(DpsUser dpsUser);

        /// <summary>
        /// Save New Customer User
        /// </summary>
        /// <param name="dpsUser"></param>
        /// <returns></returns>
        Task<string> UpdateUserAsync(DpsUser dpsUser);

        /// <summary>
        /// Save New Customer User
        /// </summary>
        /// <param name="CustomerVatNumber"></param>
        /// <param name="isArchived"></param>
        /// <returns></returns>
        Task<DpsUser> IsUserArchivedAsync(string CustomerVatNumber, bool isArchived);

        /// <summary>
        /// Save New Customer User
        /// </summary>
        /// <param name="CustomerVatNumber"></param>
        /// <param name="isEnabled"></param>
        /// <returns></returns>
        Task<DpsUser> IsUserEnabledAsync(string CustomerVatNumber, bool isEnabled);
    }
}