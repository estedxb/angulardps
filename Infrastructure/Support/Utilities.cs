using System;
using System.Collections.Generic;
using System.Configuration;
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

        internal static string BSApiPersonUrl()
        {
            var Conn = ConfigurationManager.AppSettings["BSApiPersonUrl"];
            if (string.IsNullOrEmpty(Conn) || string.IsNullOrWhiteSpace(Conn))

            {
                Conn = "874c4bdf-e4d7-4b79-b5d8-9cd81c4417ec";
            }

            return Conn;
        }

        internal static string BSApiPersonVerson()
        {
            var verson = ConfigurationManager.AppSettings["BSApiPersonVerson"];
            
            if (string.IsNullOrEmpty(verson) || string.IsNullOrWhiteSpace(verson))

            {
                verson = "874c4bdf-e4d7-4b79-b5d8-9cd81c4417ec";
            }

            return verson;
        }

        internal static string BSApiAddEnterpriseUrl()
        {
            var url = ConfigurationManager.AppSettings["BSApiAddEnterpriseUrl"];

            if (string.IsNullOrEmpty(url) || string.IsNullOrWhiteSpace(url))

            {
                url = "874c4bdf-e4d7-4b79-b5d8-9cd81c4417ec";
            }

            return url;
        }
        
    }


}
