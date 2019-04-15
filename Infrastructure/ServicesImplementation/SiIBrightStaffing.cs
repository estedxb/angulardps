using Core.DomainModel.DpsCustomer;
using Core.ServicesInterface;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ServicesImplementation
{

    public class SiIBrightStaffing : IBrightStaffing
    {     

        internal string personAPIAccessToken;
        internal string personAPIVersion;
        internal string apiErpUrl;

        public SiIBrightStaffing(string accessToken, string version, string erpUrl)
        {
            personAPIAccessToken = accessToken;
            personAPIVersion = version;
            apiErpUrl = erpUrl;
        }

        public string AddCustomerToBS(DpsCustomer customer)
        {
            IRestResponse response = null;
            try
            {
                var client = new RestClient(apiErpUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("Postman-Token", "27d48774-e4f7-472f-8a26-0156f9cc5ee5");
                request.AddHeader("Cache-Control", "no-cache");
                request.AddHeader("content-type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
                request.AddParameter("multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW", "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"api_access_token\"\r\n\r\n" + personAPIAccessToken + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"api_version\"\r\n\r\n" + personAPIVersion + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"enterprise\"\r\n\r\n{\n\"enterprise_id\" : " +  "n/a" + ",\n\"search_name\" : \"" + "n/a" + "\",\n\"gen_name\" : \"" + "n/a" + "\",\n\"office_id\" : " + "n/a" + ",\n\"vatnumber\" : \"" +  customer.Customer.VatNumber + "\",\n\"vatcountry_iso\" : \"" + "n/a" + "\",\n\"street\" : \"" + customer.Customer.Address.Street + "\",\n\"street_nr\" : \"" + customer.Customer.Address.StreetNumber + "\",\n\"postal_code\" : " + customer.Customer.Address.PostalCode + ",\n\"city\" : \"" + customer.Customer.Address.City + "\",\n\"country_iso\" : \"" + customer.Customer.Address.CountryCode + "\",\n\"extref\" : \"" + "n/a" + "\",\n\"jobprofile_info\":\"" + "n/a" + "\"\n} \n\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--", ParameterType.RequestBody);
                response = client.Execute(request);

                return response.Content.ToString();
            }
            catch (Exception ex)
            {
               
                Trace.TraceError(ex.Message);
                return ex.Message;
            }

            
        }


    }
   
}

