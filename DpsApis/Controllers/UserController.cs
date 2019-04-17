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

        // GET: DpsApi/User
        [HttpGet]    
        public async Task<ActionResult<List<DpsUser>>> Get()
        {
            List<DpsUser> userList = new List<DpsUser>(); 
            return Ok(userList);
        }

        // GET: DpsApi/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<List<DpsUser>>> Get(int Id)
        {
            DpsUser user = new DpsUser();
            return Ok(user);
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
        public async Task<ActionResult> Update(string id, DpsUser model)
        {
            return Ok(model);
        }      

        // POST: DpsApi/User/Archive
        [HttpPut]
        [Route("Archive")]
        public async Task<ActionResult> ArchiveUser(string id, DpsUser model)
        {
            return Ok(model);
        }
    }

 
}