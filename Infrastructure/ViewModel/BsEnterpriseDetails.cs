namespace Infrastructure.ServicesImplementation
{
    public class BsEnterpriseDetails
    {
        public Enterprise enterprise { get; set; }
    }

    public class Enterprise
    {
        public string enterprise_id { get; set; }
        public string name { get; set; }
        public string official_name { get; set; }
        public string vatnumber { get; set; }
        public string street { get; set; }
        public string street_nr { get; set; }
        public string bus { get; set; }
        public string postal_code { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string phone { get; set; }
        public string fax { get; set; }
        public string mail { get; set; }
        public string is_blocked { get; set; }
        public string office_id { get; set; }
        public string office_name { get; set; }
        public string is_ex_customer { get; set; }
        public string is_customer { get; set; }
        public string is_prospect { get; set; }
        public string is_supplier { get; set; }
        public string jobprofile_info { get; set; }
        public string search_name { get; set; }
        public string gen_name { get; set; }
        public string extref { get; set; }
        public string website { get; set; }
        public string info { get; set; }
        public string inv_street { get; set; }
        public string inv_street_nr { get; set; }
        public string inv_bus { get; set; }
        public string inv_postal_code { get; set; }
        public string inv_city { get; set; }
        public string inv_country { get; set; }
        public bool trade_union { get; set; }
        public bool vat_liable { get; set; }
        public string default_vatcode { get; set; }
        public string default_paycondition { get; set; }
        public string compar_white_id { get; set; }
        public string compar_blue_id { get; set; }
        public string language_doc_id { get; set; }
        public string extref_accounting { get; set; }
        public string online_invoices_mail { get; set; }
        public string online_invoices_enabled { get; set; }
        public string online_contracts_mail { get; set; }
        public string online_contracts_enabled { get; set; }
        public string online_encodage_mails { get; set; }
        public string online_encodage_enabled { get; set; }
        public string online_prestform_mail { get; set; }
        public string online_prestform_enabled { get; set; }
        public string country_iso { get; set; }
        public string vatcountry_iso { get; set; }
        public string inv_country_iso { get; set; }
        public string invoice_period { get; set; }
        public Sector_Ids[] sector_ids { get; set; }
        public Jobdomain_Ids[] jobdomain_ids { get; set; }
        public object[] jobtitle_ids { get; set; }
        public object[] contacts { get; set; }
    }

    public class Sector_Ids
    {
        public string sector_id { get; set; }
    }

    public class Jobdomain_Ids
    {
        public string jobdomain_id { get; set; }
    }
}