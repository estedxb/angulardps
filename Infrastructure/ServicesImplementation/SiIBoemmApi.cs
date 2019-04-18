using BoemmValueObjects;
using Core.ServicesInterface;
using Infrastructure.Support;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ServicesImplementation
{
    public class SiIBoemmApi : IBoemmApi
    {
        public async Task<Customer> AddOrUpdateNewCustomerAsync(Customer Customer)
        {
            string Url = $"{Utilities.GetBoemApiBaseUrl()}/Customer";
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(Url);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(JsonConvert.SerializeObject(Customer));
                streamWriter.Flush();
            }
            var httpResponse = (HttpWebResponse)await httpWebRequest.GetResponseAsync();

            if (httpResponse.StatusCode == HttpStatusCode.OK)
            {
                var encoding = ASCIIEncoding.ASCII;
                using (var reader = new System.IO.StreamReader(httpResponse.GetResponseStream(), encoding))
                {
                    string Json = reader.ReadToEnd();
                    return JsonConvert.DeserializeObject<Customer>(Json);
                }
            }
            return null;
        }

        public async Task<Customer> GetBoemmCustomerByVatNumberAsync(string VatNumber)
        {
            try
            {
                string Url = $"{Utilities.GetBoemApiBaseUrl()}/Customer/{VatNumber}";
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(Url);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "GET";
                var httpResponse = (HttpWebResponse)await httpWebRequest.GetResponseAsync();
                if (httpResponse.StatusCode == HttpStatusCode.OK)
                {
                    var encoding = ASCIIEncoding.ASCII;
                    using (var reader = new System.IO.StreamReader(httpResponse.GetResponseStream(), encoding))
                    {
                        string Json = reader.ReadToEnd();
                        return JsonConvert.DeserializeObject<Customer>(Json);
                    }
                }
                return null;
            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}