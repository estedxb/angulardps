using BoemmValueObjects;
using Core.RepositoryInterface.IDpsCustomerUser;
using System;
using System.Threading.Tasks;

namespace Core.DomainModel.DpsCustomerUser
{
    public class DpsUser
    {
        public string CustomerVatNumber { get; set; }
        public User User { get; set; }
        public string UserRole { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsArchived { get; set; }

        public DpsUser()
        {
        }

        /// <summary>
        /// Create new customer user based on the current class instance. Return True if Customer User Created.
        /// </summary>
        /// <param name="iDpsCustomerUser"></param>
        /// <returns></returns>
        public async Task<bool> CreateNewUser(IDpsUser iDpsUser)
        {
            try
            {
                string customerId = await iDpsUser.AddNewUserAsync(this);
                if (string.IsNullOrEmpty(customerId) || string.IsNullOrWhiteSpace(customerId))
                {
                    return false;
                }
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        /// <summary>
        /// UpdateUser customer user based on the current class instance. Return True if Customer User UpdateUser.
        /// </summary>
        /// <param name="iDpsUser"></param>
        /// <returns></returns>
        public async Task<bool> UpdateUser(IDpsUser iDpsUser)
        {
            try
            {
                string customerId = await iDpsUser.UpdateUserAsync(this);
                if (string.IsNullOrEmpty(customerId) || string.IsNullOrWhiteSpace(customerId))
                {
                    return false;
                }
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}