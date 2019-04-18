using BoemmValueObjects;
using Core.RepositoryInterface.IDpsCustomer;
using Core.ServicesInterface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public bool ActivateContactAsUser { get; set; }

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
        public async Task<bool> CreateNewCustomerAsync(IDpsCustomer iDpsCustomer, IBoemmApi iboemmApi)
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

                    var boemmCustomer = await iboemmApi.AddOrUpdateNewCustomerAsync(this.Customer);
                    if (boemmCustomer != null)
                    {
                        // update DpsCustomer
                        this.Customer = boemmCustomer;
                        var Updated = await iDpsCustomer.UpdateCustomerAsync(this);
                        if (!Updated)
                        {
                            // create a job or an indeication that this customer isn't updated to match boemm DB . but we have customer alredy.
                        }
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

        public async Task<DpsCustomer> GetCustomerByVatNumberAsync(string Vat, IDpsCustomer idpsCustomer, IBoemmApi iboemmApi)
        {
            var localDpsCustomer = await idpsCustomer.GetCustomerByVatNumberAsync(Vat);
            if (localDpsCustomer != null)
            {
                return localDpsCustomer;
            }
            else
            {
                var BoemmCustomer = await iboemmApi.GetBoemmCustomerByVatNumberAsync(Vat);
                if (BoemmCustomer != null)
                {
                    DpsCustomer dpsCustomer = new DpsCustomer();
                    dpsCustomer.Customer = BoemmCustomer;
                    return dpsCustomer;
                }
                else
                {
                    return null;
                }
            }
        }

        public async Task<DpsCustomer> GetCustomerByVatNumberAsync(string Vat, IDpsCustomer idpsCustomer)
        {
            var localDpsCustomer = await idpsCustomer.GetCustomerByVatNumberAsync(Vat);
            if (localDpsCustomer != null)
            {
                return localDpsCustomer;
            }
            else
            {
                return null;
            }
        }

        public bool ValidateVat(string Vat)
        {
            return Vat.Length.Equals(12);
        }
    }
}