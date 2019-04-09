using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DpsApis.Controllers
{
    [Route("DpsApi/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        // GET: DpsApi/Customer/GetCustomers
        [HttpGet]
        [Route("GetCustomers")]
        public ActionResult GetCustomers()
        {
            List<CustomerVM> CustomersList = new List<CustomerVM>();

            return Ok(CustomersList);
        }

        // GET: DpsApi/Customer/GetCustomerById
        [HttpGet]
        [Route("GetCustomerById")]
        public ActionResult<CustomerVM> GetCustomerById(int id)
        {
            List<CustomerVM> CustomersList = new List<CustomerVM>();
            var customer = CustomersList.FirstOrDefault(c => c.Id == id);           
            if (customer!=null)
            {
                return Ok(customer); 
            }
            else
            {
                return NotFound();
            }

        }

        // POST: DpsApi/Customer/PostNewCustomer
        [HttpPost]
        [Route("PostNewCustomer")]
        public ActionResult PostNewCustomer(CustomerVM model)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                try
                {
                    List<CustomerVM> customers = new List<CustomerVM>();
                    customers.Add(model);
                    model.CustomersList = customers;
                    return Ok(model);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }

        }

        // POST: DpsApi/Customer/UpdateCustomer
        [HttpPost]
        [Route("UpdateCustomer")]
        public ActionResult UpdateCustomer(int id, CustomerVM model)
        {
            return Ok(id);
        }

        // POST: DpsApi/Customer/DeleteCustomer
        [HttpPost]
        [Route("DeleteCustomer")]
        public ActionResult DeleteCustomer(int id, CustomerVM model)
        {
            return Ok(model);
        }

        public class CustomerVM
        {
            public int Id { get; set; } 
            [StringLength(60, MinimumLength = 3)]
            [Required]
            public string CustomerName { get; set; } 
            [StringLength(60, MinimumLength = 3)]
            [Required]
            public string EmailAddress { get; set; } 
            [Required]
            public string ContactNumber { get; set; }

            public List<CustomerVM> CustomersList { get; set; }

        }

        
    }
}


