using Infrastructure.Support;
using Microsoft.WindowsAzure.Storage;

namespace Infrastructure.RepositoryImplementation
{
    public class RIBase
    {
        protected CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(Utilities.AzureStorageTableConnctionString());
    }
}