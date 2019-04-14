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

        // GET: DpsApi/User
        [HttpGet]    
        public async Task<ActionResult<List<UserVM>>> GetUsersAsync()
        {
            List<UserVM> userList = new List<UserVM>(); 
            return Ok(userList);
        }

        // GET: DpsApi/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<List<UserVM>>> GetUserByIdAsync(int Id)
        {
            UserVM user = new UserVM();
            return Ok(user);
        }

        // POST: DpsApi/User/Create
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult> CreateUserAsync(UserVM model)
        {
            return Ok(model);
        }

        // POST: DpsApi/User/Update
        [HttpPut]
        [Route("Update")]
        public async Task<ActionResult> UpdateUserAsync(UserVM model)
        {
            return Ok(model);
        }

        // POST: DpsApi/User/EnableDisableUser
        [HttpPut]
        [Route("EnableDisableUser")]
        public async Task<ActionResult> EnableDisableUserAsync(UserVM model)
        {
            return Ok(model);
        }

        // POST: DpsApi/User/Archive
        [HttpPost]
        [Route("Archive")]
        public async Task<ActionResult> ArchiveUserAsync(UserVM model)
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