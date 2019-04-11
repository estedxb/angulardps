using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using BoemmValueObjects;
using Microsoft.WindowsAzure.Storage.Table;

namespace Core.DomainModel.DpsCustomer
{
    public class DpsCustomer : TableEntity
    {
        [Key]
        public int Id { get; set; }
        public Customer Customer { get; set; }
        public Email InvoiceEmail { get; set; }
        public Email ContractsEmail { get; set; }
        public bool BulkContractsEnabled { get; set; }
        public virtual List<StatuteSettings> StatuteSettings { get; set; }
        public InvoiceSettings invoiceSettings { get; set; }
        public Contact Contact { get; set; }


        /// <summary>
        /// Constructor, Vat Number is required.
        /// </summary>
        /// <param name="VatNumber">Vat Number</param>
        /// 

        private string _VatNumber;
        public DpsCustomer(string VatNumber)
        {
            this._VatNumber = VatNumber;
        }




    }
}
