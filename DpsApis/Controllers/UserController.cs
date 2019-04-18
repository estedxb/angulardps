using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Core.DomainModel.DpsCustomerUser;
using System.Diagnostics;
using Infrastructure.RepositoryImplementation;

namespace DpsApis.Controllers
{
    [Route("DpsApi/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        
        // GET: DpsApi/User/5
        [HttpGet("{CustomerVatNumber}")]
        public async Task<ActionResult> Get(string CustomerVatNumber)
        {
            try
            {
                RIUser iUser = new RIUser();
                var user = await iUser.GetUserByCustomerVatNumberAsync(CustomerVatNumber);

                if (user!=null)
                {
                    return Ok(user);
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

        // POST: DpsApi/User/Create
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult> Post(DpsUser model)
        {
            try
            {
               
                var Saved = await model.CreateNewUser(new RIUser());
                if (Saved)
                {
                    return Ok(model);
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

        // POST: DpsApi/User/Update
        [HttpPut]
        [Route("Update")]
        public async Task<ActionResult> Update(DpsUser model)
        {
            try
            {

                var Saved = await model.UpdateUser(new RIUser());
                if (Saved)
                {
                    return Ok(model);
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

        // POST: DpsApi/User/Archive
        [HttpPut]
        [Route("IsArchived")]
        public async Task<ActionResult> IsArchived(string CustomerVatNumber, bool isArchived)
        {
            try
            {
                RIUser iUser = new RIUser();
                var user = await iUser.IsUserArchivedAsync(CustomerVatNumber, isArchived);

                if (user != null)
                {
                    return Ok(user);
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

        // POST: DpsApi/User/Archive
        [HttpPut]
        [Route("IsEnabled")]
        public async Task<ActionResult> IsEnabled(string CustomerVatNumber, bool isEnabled)
        {
            try
            {
                RIUser iUser = new RIUser();
                var user = await iUser.IsUserEnabledAsync(CustomerVatNumber, isEnabled);

                if (user != null)
                {
                    return Ok(user);
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
    }

 
}