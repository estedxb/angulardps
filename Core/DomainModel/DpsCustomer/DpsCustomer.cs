using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Threading.Tasks;
using BoemmValueObjects;
using Core.RepositoryInterface.IDpsCustomer;
using Microsoft.WindowsAzure.Storage.Table;

namespace Core.DomainModel.DpsCustomer
{
    public class DpsCustomer
    {

        public Customer Customer { get; set; }
        public Email InvoiceEmail { get; set; }
        public Email ContractsEmail { get; set; }
        public bool BulkContractsEnabled { get; set; }
        public List<StatuteSettings> StatuteSettings { get; set; }
        public InvoiceSettings invoiceSettings { get; set; }
        public Contact Contact { get; set; }


        /// <summary>
        /// Constructor, Vat Number is required.
        /// </summary>
        /// <param name="VatNumber">Vat Number</param>
        /// 

        public DpsCustomer()
        {
        }

        public DpsCustomer(string VatNumber)
        {
            this.Customer.VatNumber = VatNumber;
        }

        /// <summary>
        /// Create new customer based on the current class instance. Return True if Customer Created.
        /// </summary>
        /// <param name="iDpsCustomer"></param>
        /// <returns></returns>
        public async Task<bool> CreateNewCustomerAsync(IDpsCustomer iDpsCustomer)
        {
            try
            {
                // validation ....
                if (string.IsNullOrEmpty(this.Customer.VatNumber) || string.IsNullOrWhiteSpace(this.Customer.VatNumber))
                {
                    return false;
                }
                else
                {
                    string VatNumber = await iDpsCustomer.AddNewCustomerAsync(this);
                    if (string.IsNullOrEmpty(VatNumber) || string.IsNullOrWhiteSpace(VatNumber))
                    {
                        return false;
                    }
                    return true;
                }

            }
            catch (Exception e)
            {

                throw;
            }
        }



        public async Task<List<Tuple<string, string, string>>> GetCustomerVatAndNameAsync(IDpsCustomer idpsCustomer)
        {
            var allCustomers = await idpsCustomer.GetAllCustomersAsync();
            var Model = new List<Tuple<string, string, string>>();
            foreach (var customer in allCustomers)
            {
                Model.Add(new Tuple<string, string, string>(customer.Customer.VatNumber, customer.Customer.Name, customer.Customer.OfficialName));
            }
            return Model;
        }


        public async Task<List<DpsCustomer>> GetAllCustomersAsync(IDpsCustomer idpsCustomer)
        {
            return await idpsCustomer.GetAllCustomersAsync();
        }


        public async Task<DpsCustomer> GetCustomerByVatNumberAsync(string Vat, IDpsCustomer idpsCustomer)
        {
            return await idpsCustomer.GetCustomerByVatNumberAsync(Vat);
        }

    }




}
