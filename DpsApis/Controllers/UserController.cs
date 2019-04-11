using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DpsApis.Controllers
{
    [Route("DpsApi/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        // POST: DpsApi/User/Create
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult> CreateUser(UserVM model)
        {
            return Ok(model);
        }

        // POST: DpsApi/User/Update
        [HttpPost]
        [Route("Update")]
        public async Task<ActionResult> UpdateUser(UserVM model)
        {
            return Ok(model);
        }

        // POST: DpsApi/User/EnableDisableUser
        [HttpPost]
        [Route("EnableDisableUser")]
        public async Task<ActionResult> EnableDisableUser(UserVM model)
        {
            return Ok(model);
        }

        // POST: DpsApi/User/Archive
        [HttpPost]
        [Route("Archive")]
        public async Task<ActionResult> ArchiveUser(UserVM model)
        {
            return Ok(model);
        }
    }

    public class UserVM
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string MobilePhoneNumber { get; set; }
        public string PhoneNumber { get; set; }
    }
}