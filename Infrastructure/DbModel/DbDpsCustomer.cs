using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.DbModel
{
    internal class DbDpsCustomer : TableEntity
    {
        public string DpsCustomer { get; set; }
    }
}
