using Core.DomainModel.DpsCustomer;
using Infrastructure.RepositoryImplementation;
using Infrastructure.ServicesImplementation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

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
            try
            {
                DpsCustomer dpsCustomer = new DpsCustomer();
                return Ok(await dpsCustomer.GetAllCustomersAsync(new RICustomer()));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetAllCustomersPreviewJson")]
        public async Task<ActionResult> GetAllCustomersPreviewJson()
        {
            try
            {
                DpsCustomer dpsCustomer = new DpsCustomer();
                return Ok(await dpsCustomer.GetCustomerVatAndNameAsync(new RICustomer()));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return BadRequest(e.Message);
            }
        }

        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id)
        {
            try
            {
                DpsCustomer dpsCustomer = new DpsCustomer();
                var Model = await dpsCustomer.GetCustomerByVatNumberAsync(id, new RICustomer());

                if (Model != null)
                {
                    return Ok(Model);
                }
                else
                {
                    return NoContent();
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return BadRequest(e.Message);
                throw;
            }
        }

        // GET: api/Customer/5
        [Route("GetCustomerByVatNumber")]
        //[HttpGet("{VatNumber}")]
        public async Task<ActionResult> GetCustomerByVatNumber(string VatNumber)
        {
            DpsCustomer dpsCustomer = new DpsCustomer();

            if (!dpsCustomer.ValidateVat(VatNumber))
            {
                return BadRequest();
            }

            var Model = await dpsCustomer.GetCustomerByVatNumberAsync(VatNumber, new RICustomer(), new SiIBoemmApi());
            if (Model == null)
            {
                return NoContent();
            }
            else if (Model.invoiceSettings == null && Model.Contact == null)
            {
                return Ok(Model);
            }
            else
            {
                return Conflict();
            }
        }

        // POST: api/Customer/
        [HttpPost]
        public async Task<ActionResult> Post(DpsCustomer value)
        {
            try
            {
                //var DpsCustomer = JsonConvert.DeserializeObject<DpsCustomer>(value);
                var Saved = await value.CreateNewCustomerAsync(new RICustomer(), new SiIBoemmApi());
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
                return BadRequest(e.Message);
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