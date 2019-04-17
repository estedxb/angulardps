using Core.DomainModel.DpsCustomer;
using Core.RepositoryInterface.IDpsCustomer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.WindowsAzure.Storage.Table;
using Infrastructure.DbModel;
using Newtonsoft.Json;

namespace Infrastructure.RepositoryImplementation
{
    public class RICustomer : RIBase, IDpsCustomer
    {


        /// <summary>
        /// Get Customer By Vat Number...
        /// </summary>
        /// <param name="VatNumber">Vat Number is UID for Customers</param>
        /// <returns></returns>

        public async Task<DpsCustomer> GetCustomerByVatNumberAsync(string VatNumber)
        {
            var tableClient = cloudStorageAccount.CreateCloudTableClient();
            var table = tableClient.GetTableReference("customer");


            TableQuery<DbDpsCustomer> query = new TableQuery<DbDpsCustomer>().Where(
                TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, VatNumber)).Take(1);
            var Recored = await table.ExecuteQuerySegmentedAsync(query, null);

            if (Recored.Count() > 0)
            {


                var DpsCustomer = JsonConvert.DeserializeObject<DpsCustomer>(Recored.Single().DpsCustomer);
                return DpsCustomer;
            }
            else
            {
                return null;
            }
        }


        public async Task<string> AddNewCustomerAsync(DpsCustomer dpsCustomer)
        {
            try
            {
                DbDpsCustomer dbDpsCustomer = new DbDpsCustomer();

                dbDpsCustomer.RowKey = dpsCustomer.Customer.VatNumber;
                dbDpsCustomer.PartitionKey = dpsCustomer.Customer.Name.Replace(" ", "");
                dbDpsCustomer.DpsCustomer = JsonConvert.SerializeObject(dpsCustomer);

                var tableClient = cloudStorageAccount.CreateCloudTableClient();
                var table = tableClient.GetTableReference("customer");
                await table.CreateIfNotExistsAsync();
                TableOperation tableOperation = TableOperation.Insert(dbDpsCustomer);
                await table.ExecuteAsync(tableOperation);

                return dpsCustomer.Customer.VatNumber;
            }
            catch (Exception e)
            {
                throw;
            }
        }


        public Task<List<DpsCustomer>> GetAllCustomersAsync()
        {
            throw new NotImplementedException();
        }
    }
}
