using Microsoft.WindowsAzure.Storage.Table;

namespace Infrastructure.DbModel
{
    internal class DbDpsCustomer : TableEntity
    {
        public string DpsCustomer { get; set; }
    }
}