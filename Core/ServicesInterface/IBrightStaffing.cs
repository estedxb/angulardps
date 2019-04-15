using Core.DomainModel.DpsCustomer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.ServicesInterface
{
    public interface IBrightStaffing
    {
        /// <summary>
        /// Get Customer By Vat Number, Vat Number is ID 
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        string AddCustomerToBS(DpsCustomer customer);

       

        //string AddEnterprise(string status, string enterprise_id, string search_name, string gen_name, string office_id, string VATNumber, string vatcountry_iso, string street, string street_nr, string postal_code, string city, string country_iso, string extref, string jobprofile);

       
    }
}
