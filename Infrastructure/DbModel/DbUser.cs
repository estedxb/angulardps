using Microsoft.WindowsAzure.Storage.Table;

namespace Infrastructure.DbModel
{
    internal class DbUser : TableEntity
    {
        public string DpsUser { get; set; }
    }
}