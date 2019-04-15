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
        public  List<StatuteSettings> StatuteSettings { get; set; }
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
        public async Task<bool> CreateNewCustomer(IDpsCustomer iDpsCustomer)
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
                    string VatNumber = await iDpsCustomer.AddNewCustomer(this);
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





    }
}
