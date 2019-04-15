using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text;

namespace Infrastructure.Support
{
    public static class Utilities
    {
        public static string AzureStorageTableConnctionString() => System.Configuration.ConfigurationManager.AppSettings["AzureStorageTableConnctionString"];

        internal static string BSURL()
        {
            return ConfigurationManager.AppSettings["BSURL"];
        }

        internal static string BSURLToken()
        {
            return ConfigurationManager.AppSettings["BSURLToken"];
        }

        internal static string BSURLVersionNumber()
        {
            return ConfigurationManager.AppSettings["BSURLVersionNumber"];
        }
    }


}
