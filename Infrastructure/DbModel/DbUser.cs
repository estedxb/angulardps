using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.DbModel
{
    internal class DbUser : TableEntity
    {
        public string DpsUser { get; set; }
    }
}
