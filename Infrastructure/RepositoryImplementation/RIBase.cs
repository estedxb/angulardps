using Infrastructure.Support;
using Microsoft.WindowsAzure.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.RepositoryImplementation
{
    public class RIBase
    {
        protected CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(Utilities.AzureStorageTableConnctionString());

    }
}
