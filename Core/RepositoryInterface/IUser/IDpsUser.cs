using Core.DomainModel.DpsCustomerUser;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.RepositoryInterface.IDpsCustomerUser
{
    public interface IDpsUser
    {
        /// <summary>
        /// Get Customer By id, 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<DpsUser> GetUserByIDAsync(int id);

        /// <summary>
        /// Save New Customer User
        /// </summary>
        /// <param name="dpsCustomer"></param>
        /// <returns></returns>
        Task<string> AddNewUserAsync(DpsUser dpsUser);

        /// <summary>
        /// Save New Customer User
        /// </summary>
        /// /// <param name="id"></param>
        /// <param name="dpsUser"></param>
        /// <returns></returns>
        Task<string> UpdateUserAsync( DpsUser dpsUser);
    }
}
