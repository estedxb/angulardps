using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using BoemmValueObjects;

namespace Core.DomainModel.DpsCustomer
{
    public class DpsCustomer
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




    }
}
