using Core.DomainModel.DpsCustomerUser;
using Core.RepositoryInterface.IDpsCustomerUser;
using Infrastructure.DbModel;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
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

                dbDpsUser.RowKey = dpsUser.User.UserName;
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
                Trace.TraceError(e.Message);
                throw;
            }
        }

        public async Task<DpsUser> GetUserByCustomerVatNumberAsync(string VatNumber)
        {
            try
            {
                var tableClient = cloudStorageAccount.CreateCloudTableClient();
                var table = tableClient.GetTableReference("user");

                TableQuery<DbUser> query = new TableQuery<DbUser>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, VatNumber)).Take(1);
                var Recored = await table.ExecuteQuerySegmentedAsync(query, null);

                var User = JsonConvert.DeserializeObject<DpsUser>(Recored.Single().DpsUser);
                return User;
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                throw;
            }
        }

        public async Task<string> UpdateUserAsync(DpsUser dpsUser)
        {
            try
            {
                DbUser dbDpsUser = new DbUser();
                dbDpsUser.DpsUser = JsonConvert.SerializeObject(dpsUser);

                var tableClient = cloudStorageAccount.CreateCloudTableClient();
                var table = tableClient.GetTableReference("user");

                TableOperation tableOperation = TableOperation.InsertOrReplace(dbDpsUser);
                await table.ExecuteAsync(tableOperation);

                return dpsUser.CustomerVatNumber;
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                throw;
            }
        }

        public async Task<DpsUser> IsUserArchivedAsync(string VatNumber, bool isArchived)
        {
            try
            {
                var tableClient = cloudStorageAccount.CreateCloudTableClient();
                var table = tableClient.GetTableReference("user");

                TableQuery<DbUser> query = new TableQuery<DbUser>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, VatNumber)).Take(1);
                var Recored = await table.ExecuteQuerySegmentedAsync(query, null);

                var User = JsonConvert.DeserializeObject<DpsUser>(Recored.Single().DpsUser);
                User.IsArchived = isArchived;
                User.IsEnabled = isArchived == true ? false : true;

                DbUser dbDpsUser = new DbUser();
                dbDpsUser.RowKey = User.User.UserName;
                dbDpsUser.PartitionKey = User.CustomerVatNumber;
                dbDpsUser.DpsUser = JsonConvert.SerializeObject(User);

                TableOperation tableOperation = TableOperation.InsertOrReplace(dbDpsUser);
                await table.ExecuteAsync(tableOperation);

                return User;
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                throw;
            }
        }

        public async Task<DpsUser> IsUserEnabledAsync(string VatNumber, bool isEnabled)
        {
            try
            {
                var tableClient = cloudStorageAccount.CreateCloudTableClient();
                var table = tableClient.GetTableReference("user");

                TableQuery<DbUser> query = new TableQuery<DbUser>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, VatNumber)).Take(1);
                var Recored = await table.ExecuteQuerySegmentedAsync(query, null);

                var User = JsonConvert.DeserializeObject<DpsUser>(Recored.Single().DpsUser);
                User.IsEnabled = isEnabled;

                DbUser dbDpsUser = new DbUser();
                dbDpsUser.RowKey = User.User.UserName;
                dbDpsUser.PartitionKey = User.CustomerVatNumber;
                dbDpsUser.DpsUser = JsonConvert.SerializeObject(User);

                TableOperation tableOperation = TableOperation.InsertOrReplace(dbDpsUser);
                await table.ExecuteAsync(tableOperation);

                return User;
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                throw;
            }
        }

        public Task<List<DpsUser>> GetAllUsersAsync()
        {
            throw new NotImplementedException();
        }
    }
}