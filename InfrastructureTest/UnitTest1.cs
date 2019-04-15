using BoemmValueObjects;
using Core.DomainModel.DpsCustomer;
using Infrastructure.ServicesImplementation;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Configuration;

namespace Tests
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }


        [Test]
        public void AddCustomerToBSTest()
        {
            SiIBrightStaffing addEnterprise = new SiIBrightStaffing(ConfigurationManager.AppSettings["APIPersonUrl"], ConfigurationManager.AppSettings["APIPersonVerson"], ConfigurationManager.AppSettings["AddEnterprise"]);

            DpsCustomer Model = new DpsCustomer();

            // Customer
            Customer customer = new Customer();
            customer.VatNumber = "B001";
            customer.Name = "Test Name";
            customer.OfficialName = "Test Offical Name";
            customer.LegalForm = "Test LehalForm";
            customer.Address = new Address { Bus = "Bus", City = "Magic City", Country = "UAE", CountryCode = "UAE", PostalCode = "00", Street = "Magic Street", StreetNumber = "558" };
            customer.PhoneNumber = new PhoneNumber { Number = "+971548788415" };
            customer.Email = new Email { EmailAddress = "testmail@testServer.test" };
            customer.VCACertification = new VCACertification { Cerified = false };
            customer.CreditCheck = new CreditCheck { Creditcheck = false, CreditLimit = 10, DateChecked = DateTime.Now };
            Model.Customer = customer;



            // invoice setting ...
            var OtherAllowanceList = new List<OtherAllowance>();
            OtherAllowanceList.Add(new OtherAllowance { Amount = 15, CodeId = new Guid(), Nominal = false });

            var ShiftAllownsList = new List<ShiftAllowance>();
            ShiftAllownsList.Add(new ShiftAllowance { Amount = 12, Nominal = false, ShiftName = "testShiftName", TimeSpan = new TimeSpan(10, 10, 10) });

            //
            Model.InvoiceEmail = new Email { EmailAddress = "InvoiceMail@mail.com" };
            Model.ContractsEmail = new Email { EmailAddress = "ContractMail@mail.com" };
            Model.BulkContractsEnabled = false;
            Model.invoiceSettings = new InvoiceSettings
            {
                HolidayInvoiced = false,
                LieuDaysAllowance =
                new LieuDaysAllowance { Enabled = false, Payed = false },
                MobilityAllowance = new MobilityAllowance { Enabled = false, AmountPerKm = 0 },
                OtherAllowances = OtherAllowanceList,
                ShiftAllowance = true,
                ShiftAllowances = ShiftAllownsList,
                SicknessInvoiced = true
            };


            // contact 
            Model.Contact = new Contact
            {
                Email = new Email { EmailAddress = "Contact@customerdoain.com" },
                FirstName = "Alex",
                Language = new Language
                { Name = "English", ShortName = "En" },
                LastName = "SuperMan",
                Mobile = new PhoneNumber { Number = "+97154254528" },
                PhoneNumber = new PhoneNumber { Number = "+971545458578" },
                Postion = "Postion"
            };


            Model.StatuteSettings = new List<StatuteSettings>();
            Model.StatuteSettings.Add(new StatuteSettings
            {
                Coefficient = 2,
                MealVoucherSettings = new MealVoucherSettings { EmployerShare = 50, MinimumHours = 60, TotalWorth = 600 },
                ParitairCommitee = new BOEMMParitairCommitee { Name = "BOEMMParitairCommitee Name", Number = "251465463sd" },
                Statute = new Statute { Name = "Statute Name" }
            });
            

            addEnterprise.AddCustomerToBS(Model);
        }
    }
}