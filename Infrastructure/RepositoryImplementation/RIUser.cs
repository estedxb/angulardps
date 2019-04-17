using Core.DomainModel.DpsCustomerUser;
using Core.RepositoryInterface.IDpsCustomerUser;
using Infrastructure.DbModel;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.RepositoryImplementation
{
    public class RIUser : RIBase, IDpsUser
    {
        public async Task<string> AddNewUserAsync(DpsUser dpsUser)
        {
            try
            {
                DbUser dbDpsUser = new DbUser();

                dbDpsUser.RowKey =  dpsUser.User.UserName;
                dbDpsUser.PartitionKey = dpsUser.CustomerVatNumber;
                dbDpsUser.DpsUser = JsonConvert.SerializeObject(dpsUser);

                var tableClient = cloudStorageAccount.CreateCloudTableClient();
                var table = tableClient.GetTableReference("user");
                await table.CreateIfNotExistsAsync();
                TableOperation tableOperation = TableOperation.Insert(dbDpsUser);
                await table.ExecuteAsync(tableOperation);

                return dpsUser.CustomerVatNumber;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public Task<DpsUser> GetUserByIDAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<string> UpdateUserAsync( DpsUser dpsUser)
        {
            DbUser dbDpsUser = new DbUser();            
            dbDpsUser.DpsUser = JsonConvert.SerializeObject(dpsUser);

            var tableClient = cloudStorageAccount.CreateCloudTableClient();
            var table = tableClient.GetTableReference("user");


            TableOperation tableOperation = TableOperation.InsertOrReplace(dbDpsUser);
            await table.ExecuteAsync(tableOperation);

            return dpsUser.CustomerVatNumber;
            
        }
    }
}
