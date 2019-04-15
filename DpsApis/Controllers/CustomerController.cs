using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using BoemmValueObjects;
using Core.DomainModel.DpsCustomer;
using DpsApis.ViewModels;
using Infrastructure.RepositoryImplementation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DpsApis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {


        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            List<CustomerVM> CustomersList = new List<CustomerVM>();
            CustomerVM customerVM1 = new CustomerVM();
            customerVM1.VATNumber = "123";
            customerVM1.OfficialName = "abc";
            customerVM1.Name = "abc";

            CustomerVM customerVM2 = new CustomerVM();
            customerVM2.VATNumber = "456";
            customerVM2.OfficialName = "cde";
            customerVM2.Name = "cde";

            CustomerVM customerVM3 = new CustomerVM();
            customerVM3.VATNumber = "789";
            customerVM3.OfficialName = "efg";
            customerVM3.Name = "efg";

            CustomersList.Add(customerVM1);
            CustomersList.Add(customerVM2);
            CustomersList.Add(customerVM3);
            

            return Ok(CustomersList);
        }



        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
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


            return Ok(Model);
        }



        // POST: api/Customer/
        [HttpPost]
        public async Task<ActionResult> Post(DpsCustomer value)
        {

            try
            {
                //var DpsCustomer = JsonConvert.DeserializeObject<DpsCustomer>(value);
                var Saved = await value.CreateNewCustomer(new RICustomer());
                if (Saved)
                {
                    return Ok(value.Customer.VatNumber);
                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return StatusCode(500);

            }
        }



        // POST: api/Customer/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, CustomerVM model)
        {
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Put(string id)
        {
            return Ok();
        }


        // GET: api/Customer/WorkSchedules
        [HttpGet]
        [Route("WorkSchedules")]
        public async Task<ActionResult<CustomerWorkScheduleVM>> GetWorkSchedulesAsync()
        {
            //List<CustomerWorkScheduleVM> workSchedulesList = new List<CustomerWorkScheduleVM>();

            List<WorkTimeVM> workTimeList = new List<WorkTimeVM>();
            WorkTimeVM workTimeVM = new WorkTimeVM();
            workTimeList.Add(workTimeVM);

            List<BreakTimeVM> breakTimesList = new List<BreakTimeVM>();
            BreakTimeVM breakTimeVM = new BreakTimeVM();
            breakTimesList.Add(breakTimeVM);



            WorkDayVM workDayVM1 = new WorkDayVM();
            workDayVM1.DayOfWeek = 1;
            workDayVM1.WorkTimes = workTimeList;
            workDayVM1.BreakTime = breakTimesList;

            WorkDayVM workDayVM2 = new WorkDayVM();
            workDayVM2.DayOfWeek = 2;
            workDayVM2.WorkTimes = workTimeList;
            workDayVM2.BreakTime = breakTimesList;

            WorkDayVM workDayVM3 = new WorkDayVM();
            workDayVM3.DayOfWeek = 3;
            workDayVM3.WorkTimes = workTimeList;
            workDayVM3.BreakTime = breakTimesList;

            WorkDayVM workDayVM4 = new WorkDayVM();
            workDayVM4.DayOfWeek = 4;
            workDayVM4.WorkTimes = workTimeList;
            workDayVM4.BreakTime = breakTimesList;

            WorkDayVM workDayVM5 = new WorkDayVM();
            workDayVM5.DayOfWeek = 5;
            workDayVM5.WorkTimes = workTimeList;
            workDayVM5.BreakTime = breakTimesList;

            List<WorkDayVM> workDayList = new List<WorkDayVM>();
            workDayList.Add(workDayVM1);
            workDayList.Add(workDayVM2);
            workDayList.Add(workDayVM3);
            workDayList.Add(workDayVM4);
            workDayList.Add(workDayVM5);

            WorkScheduleVM workSchedule = new WorkScheduleVM();
            workSchedule.WorkDays = workDayList;

            CustomerWorkScheduleVM workSchedules = new CustomerWorkScheduleVM();
            workSchedules.WorkSchedule = workSchedule;


            return Ok(workSchedules);

        }

        // GET: api/Customer/Positions
        [HttpGet]
        [Route("Positions")]
        public async Task<ActionResult<CustomerPostionVM>> GetPositionsAsync()
        {
            List<CustomerPostionVM> postionsList = new List<CustomerPostionVM>();
            CustomerPostionVM customerPostion = new CustomerPostionVM();
            postionsList.Add(customerPostion);
            postionsList.Add(customerPostion);
            postionsList.Add(customerPostion);
            return Ok(postionsList);

        }

        // GET: api/Customer/Locations
        [HttpGet]
        [Route("Locations")]
        public async Task<ActionResult<CustomerLocationVM>> GetLocationsAsync()
        {
            List<CustomerLocationVM> locationsList = new List<CustomerLocationVM>();
            CustomerLocationVM customerLocation = new CustomerLocationVM();
            locationsList.Add(customerLocation);
            locationsList.Add(customerLocation);
            locationsList.Add(customerLocation);
            locationsList.Add(customerLocation);
            return Ok(locationsList);

        }








    }
    public class CustomerVM
    {
        //public Guid Id { get; set; } = Guid.NewGuid();
        public string VATNumber { get; set; }
        public string Name { get; set; } 
        public string OfficialName { get; set; } 
        public string LegalForm { get; set; } = "Abc";
        public CreditCheckVM CreditCheck { get; set; } = new CreditCheckVM();
        public string Address { get; set; } = "Qwerty";
        public string PhoneNumber { get; set; } = "+971557142152";
        public string Email { get; set; } = "Qwerty@abc.com";
        public VCACertificationVM VCACertification { get; set; } = new VCACertificationVM();

    }

    public class VCACertificationVM
    {
        public bool Certified { get; set; } = true;
    }

    public class CustomerWorkScheduleVM
    {
        public Guid CustomerId { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = "Qwerty";
        public WorkScheduleVM WorkSchedule { get; set; } = new WorkScheduleVM();
        public bool IsEnabled { get; set; } = true;
        public bool IsArchived { get; set; } = false;
    }

    public class WorkScheduleVM
    {
        public List<WorkDayVM> WorkDays { get; set; } = new List<WorkDayVM>();
    }

    public class WorkDayVM
    {
        public int DayOfWeek { get; set; } = DateTime.Now.Day;
        public List<WorkTimeVM> WorkTimes { get; set; } = new List<WorkTimeVM>();
        public List<BreakTimeVM> BreakTime { get; set; } = new List<BreakTimeVM>();
    }

    public class BreakTimeVM
    {
        public TimeSpan TimeSpan { get; set; } = new TimeSpan(2, 0, 0);
    }

    public class WorkTimeVM
    {
        public TimeSpan TimeSpan { get; set; } = new TimeSpan(8, 0, 0);
    }

    public class CustomerPostionVM
    {
        public Guid CustomerId { get; set; } = Guid.NewGuid();
        public PositionVM Position { get; set; } = new PositionVM();
        public bool IsEnabled { get; set; } = true;
        public bool IsArchived { get; set; } = false;
    }

    public class PositionVM
    {
        public string Name { get; set; } = "PositionName";
        public string TaskDescription { get; set; } = "TaskDescription";
        public bool IsStudentAllowed { get; set; } = true;
        public string CostCenter { get; set; } = "CostCenter";
        public DocumentVM WorkStationDocument { get; set; }
    }

    public class DocumentVM
    {
    }

    public class CustomerLocationVM
    {
        public Guid CustomerId { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = "Name";
        public AddressVM Address { get; set; } = new AddressVM();
        public bool IsEnabled { get; set; } = true;
        public bool IsArchived { get; set; } = false;
    }

    public class AddressVM
    {
        public string Street { get; set; } = "Street";
        public string StreetNumber { get; set; } = "StreetNumber";
        public string Bus { get; set; } = "Bus";
        public string City { get; set; } = "City";
        public string PostalCode { get; set; } = "PostalCode";
        public string Country { get; set; } = "Country";
        public string CountryCode { get; set; } = "Country";
    }

    public class CreditCheckVM
    {
        public bool CreditWorthy { get; set; } = true;
        public double CreditLimit { get; set; } = 100000;
        public DateTime DateChecked { get; set; } = DateTime.Now.AddMonths(-3).Date;

        public bool CreditCheck(string VATNumber)
        {
            return true;
        }
    }
}


