using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Support
{
    public static class Utilities
    {
        public static string AzureStorageTableConnctionString() => System.Configuration.ConfigurationManager.AppSettings["AzureStorageTableConnctionString"];
    }
}
