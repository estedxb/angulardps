using Core.DomainModel.DpsCustomer;
using Core.ServicesInterface;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
        internal string bsPostEnterpriseApiErpUrl;
        internal string bsGetEnterpriseApiErpUrl;

        public SiIBrightStaffing(string accessToken, string version, string erpPostEntUrl, string erpGetEntUrl)
        {
            personAPIAccessToken = accessToken;
            personAPIVersion = version;
            bsPostEnterpriseApiErpUrl = erpPostEntUrl;
            bsGetEnterpriseApiErpUrl = erpGetEntUrl;

        }

        public string FormatCountryISO(DpsCustomer customer)
        {
            try
            {
                if (customer!=null)
                {                    
                    return customer.Customer.Address.CountryCode.ToUpper() == "BE" ? "B" : customer.Customer.Address.CountryCode;                                     
                }
                return null;
            }
            catch (Exception ex)
            {
                Trace.TraceError(ex.Message);
                return ex.Message;
            }

        }

        public string FormatVatNumber(string vatNumber, string countryCode)
        {
            try
            {               
                return countryCode == "BE" ? countryCode + "" + vatNumber : vatNumber;                
            }
            catch (Exception ex)
            {
                Trace.TraceError(ex.Message);
                return ex.Message;
            }

        }


        public BsEnterpriseDetails getEnterpriseDetails(string vatNumber, string countryCode, string extended)
        {
            IRestResponse response = null;            
            BsEnterpriseDetails bsEnterpriseDetails = new BsEnterpriseDetails();          

            try
            {
                string formattedVatNumber = FormatVatNumber(vatNumber, countryCode);              

                var client = new RestClient(bsGetEnterpriseApiErpUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("postman-token", "7aa5bc66-336a-0195-08f6-add2278a5bfc");
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("content-type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
                request.AddParameter("multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW", "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"api_access_token\"\r\n\r\n" + personAPIAccessToken + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"api_version\"\r\n\r\n" + personAPIVersion + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"vat\"\r\n\r\n" + formattedVatNumber + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"extended\"\r\n\r\n" + extended + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--", ParameterType.RequestBody);
                response = client.Execute(request);

                var stri =  response.Content;

                var entDetails =  JsonConvert.DeserializeObject<BsEnterpriseDetails>(stri);
                return entDetails;
            }
            catch (Exception ex)
            {
                 Console.WriteLine(ex.ToString());
                
            }
            return bsEnterpriseDetails;
        }

        public int AddCustomerToBS(DpsCustomer customer)
        {
            IRestResponse response = null;
            try
            {
                string enterprise_id, office_id, extref, jobprofile_info;
                var entDetails = getEnterpriseDetails(customer.Customer.VatNumber, customer.Customer.Address.CountryCode,  "1");
                if (entDetails.enterprise!=null)
                {
                    enterprise_id = entDetails.enterprise.enterprise_id;
                    office_id = entDetails.enterprise.office_id;
                    extref = entDetails.enterprise.extref == "" ? "null" : entDetails.enterprise.extref; 
                    jobprofile_info = entDetails.enterprise.jobprofile_info ==""? "null" : entDetails.enterprise.jobprofile_info;
                }
                else
                {
                    enterprise_id = "0";
                    office_id = "30";
                    extref = "null";
                    jobprofile_info = "null";
                }

                string country_iso = FormatCountryISO(customer);

                var client = new RestClient(bsPostEnterpriseApiErpUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("Postman-Token", "27d48774-e4f7-472f-8a26-0156f9cc5ee5");
                request.AddHeader("Cache-Control", "no-cache");
                request.AddHeader("content-type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
                request.AddParameter("multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW", "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"api_access_token\"\r\n\r\n" + personAPIAccessToken + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"api_version\"\r\n\r\n" + personAPIVersion + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"enterprise\"\r\n\r\n{\n\"enterprise_id\" : " + enterprise_id + ",\n\"search_name\" : \"" + customer.Customer.Name + "\",\n\"gen_name\" : \"" + customer.Customer.Name + "\",\n\"office_id\" : " + office_id + ",\n\"vatnumber\" : \"" +  customer.Customer.VatNumber + "\",\n\"vatcountry_iso\" : \"" + country_iso + "\",\n\"street\" : \"" + customer.Customer.Address.Street + "\",\n\"street_nr\" : \"" + customer.Customer.Address.StreetNumber + "\",\n\"postal_code\" : " + customer.Customer.Address.PostalCode + ",\n\"city\" : \"" + customer.Customer.Address.City + "\",\n\"country_iso\" : \"" + country_iso + "\",\n\"extref\" : \"" + extref + "\",\n\"jobprofile_info\":\"" + jobprofile_info + "\"\n} \n\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--", ParameterType.RequestBody);
                response = client.Execute(request);

                var Result = response.Content;
                JObject jObj = JObject.Parse(Result); 
                int entId = int.Parse(jObj["enterprise_id"].ToString());                

                return entId;
            }
            catch (Exception ex)
            {               
                Trace.TraceError(ex.Message);
                return 0;
            }

            
        }


    }
   
}

