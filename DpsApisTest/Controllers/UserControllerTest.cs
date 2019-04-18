using Core.DomainModel.DpsCustomerUser;
using DpsApis.Controllers;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using BoemmValueObjects;

namespace DpsApisTest.Controllers
{
    public class UserControllerTest
    {
        [Test]
        public async Task GetUserByCustomerVatNumberTestAsync()
        {
            // Arrange
            UserController userController = new UserController();

            // Act
            var actionResult = await  userController.Get("test1");

            // Assert
              Assert.IsInstanceOf(typeof(OkObjectResult), actionResult);
        }

        [Test]
        public async Task PostNewUserTest()
        {
            // Arrange
            UserController userController = new UserController();
            Email email = new Email { EmailAddress = "testmail@testServer.test" };
            PhoneNumber phoneNumber = new PhoneNumber { Number = "+971548788415" };
            DpsUser user = new DpsUser();
            user.CustomerVatNumber = "test2";
            user.IsEnabled = true;
            user.IsArchived = true;
            user.UserRole = "test2";
            user.User.Email = email;
            user.User.FirstName = "test2";
            user.User.LastName = "test2";
            user.User.Mobile = phoneNumber;
            user.User.UserName = "test2";

            // Act
            var actionResult = await userController.Post(user);

            // Assert
            Assert.IsInstanceOf(typeof(OkResult), actionResult);
        }

        [Test]
        public void UpdateUserTest()
        {
            // Arrange
            UserController userController = new UserController();
            DpsUser user = new DpsUser();

            // Act
            var actionResult = userController.Update(user);

            // Assert
            Assert.IsInstanceOf(typeof(OkResult), actionResult);
        }

        [Test]
        public void  ArchiveUserTest()
        {
            // Arrange
            UserController userController = new UserController();

            // Act
            var actionResult = userController.IsArchived("test1", true);

            // Assert
            Assert.IsInstanceOf(typeof(OkResult), actionResult);
        }

        [Test]
        public void EnableDisableUserTest()
        {
            // Arrange
            UserController userController = new UserController();

            // Act
            var actionResult = userController.IsEnabled("test1", true);

            // Assert
            Assert.IsInstanceOf(typeof(OkResult), actionResult);
        }

    }
}
