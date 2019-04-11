using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DpsApis.ViewModels
{
   
    public class CustomerFromOneVM
    {
        public int userid { get; set; }
        public Customerdetail customerdetail { get; set; }
        public Contactdetail contactDetail { get; set; }
    }

    public class Customerdetail
    {
        public string vatnumber { get; set; }
        public bool checkcheck { get; set; }
        public int creditlimt { get; set; }
        public string customername { get; set; }
        public string officialname { get; set; }
        public string legalform { get; set; }
        public string street { get; set; }
        public int streetno { get; set; }
        public string bus { get; set; }
        public string place { get; set; }
        public int postal { get; set; }
        public string country { get; set; }
        public string telephone { get; set; }
        public string generalEmail { get; set; }
        public string billingEmail { get; set; }
        public string contractEmail { get; set; }
    }

    public class Contactdetail
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string language { get; set; }
        public string position { get; set; }
        public string contactEmail { get; set; }
        public string mobileNumber { get; set; }
        public string telephone { get; set; }
        public bool createAsUser { get; set; }
    }

}
