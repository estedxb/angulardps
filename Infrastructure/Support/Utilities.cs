using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Support
{
    public static class Utilities
    {
        public static string AzureStorageTableConnctionString()
        {
            var Conn = System.Configuration.ConfigurationManager.AppSettings["AzureStorageTableConnctionString"];
            if (string.IsNullOrEmpty(Conn) || string.IsNullOrWhiteSpace(Conn))
            {
                Conn = "DefaultEndpointsProtocol=https;AccountName=dpsstorageaccountdev;AccountKey=8VYzrDWiF1MtuTXg6yo7Vtgsopbw5G2+APrThPKnuidmcMEQ8a9Vvlh5imxqV+OPR2LVsfJnY+76wsqWhjTAaQ==;EndpointSuffix=core.windows.net";
            }
            return Conn;
        }
    }
}
