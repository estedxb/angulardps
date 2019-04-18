using DpsApis.Controllers;
using DpsApis.ViewModels;
using NUnit.Framework;
using System.Threading.Tasks;

namespace DpsApisTest.Controllers
{
    internal class CustomerControllerTest
    {
        [Test]
        public async Task GetCustomersAsyncTest()
        {
            // Arrange
            CustomerController customerController = new CustomerController();

            // Act
            //var actionResult = await customerController.GetCustomersAsync();

            // Assert
            //  Assert.IsInstanceOf(typeof(ActionResult<List<CustomerFromOneVM>>), actionResult);
        }

        [Test]
        public async Task GetCustomerByIdAsyncTest()
        {
            // Arrange
            CustomerController customerController = new CustomerController();

            // Act
            //  var actionResult = await customerController.GetCustomerByIdAsync(1);

            // Assert
            //  Assert.IsInstanceOf(typeof(ActionResult<CustomerFromOneVM>),actionResult);
        }

        [Test]
        public async Task GetLocationsAsyncTest()
        {
            // Arrange
            CustomerController customerController = new CustomerController();

            // Act
            // var actionResult = await customerController.GetLocationsAsync();

            // Assert
            //  Assert.IsInstanceOf(typeof(ActionResult<CustomerLocationVM>), actionResult);
        }

        [Test]
        public async Task GetWorkSchedulesAsyncTest()
        {
            // Arrange
            CustomerController customerController = new CustomerController();

            // Act
            // var actionResult = await customerController.GetWorkSchedulesAsync();

            // Assert
            //   Assert.IsInstanceOf(typeof(ActionResult<CustomerWorkScheduleVM>), actionResult);
        }

        [Test]
        public async Task CreateCustomerForm1AsyncTest()
        {
            // Arrange
            CustomerController customerController = new CustomerController();
            Customerdetail customerdetail1 = new Customerdetail();
            customerdetail1.vatnumber = "123";
            customerdetail1.checkcheck = true;
            customerdetail1.creditlimt = 123;
            customerdetail1.customername = "customername";
            customerdetail1.officialname = "officialname";
            customerdetail1.legalform = "legalform";
            customerdetail1.street = "street";
            customerdetail1.streetno = 123;
            customerdetail1.bus = "bus";
            customerdetail1.place = "place";
            customerdetail1.postal = 123;
            customerdetail1.country = "country";
            customerdetail1.telephone = "telephone";
            customerdetail1.generalEmail = "generalEmail";
            customerdetail1.billingEmail = "billingEmail";
            customerdetail1.contractEmail = "contractEmail";

            Contactdetail contactdetail1 = new Contactdetail();

            contactdetail1.lastName = "lastName";
            contactdetail1.language = "language";
            contactdetail1.position = "position";
            contactdetail1.contactEmail = "contactEmail";
            contactdetail1.mobileNumber = "mobileNumber";
            contactdetail1.telephone = "telephone";
            contactdetail1.createAsUser = true;
            contactdetail1.mobileNumber = "mobileNumber";

            CustomerFromOneVM customerVM1 = new CustomerFromOneVM();
            customerVM1.userid = 123;
            customerVM1.customerdetail = customerdetail1;
            customerVM1.contactDetail = contactdetail1;

            // Act
            // var actionResult = await customerController.CreateCustomerForm1Async(customerVM1);

            //Assert
            //  Assert.IsInstanceOf(typeof(OkObjectResult), actionResult);
        }
    }
}