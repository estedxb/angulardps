
import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';
// Adal Login Start
import { Login, DPSCustomer, DpsUser, LoginToken, CustomersList } from './shared/models';
import { MsalService } from './shared/msal.service';
import { Router, CanActivate } from '@angular/router';
import { CustomerListsService } from './shared/customerlists.service';
// Adal Login End

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Digital Payroll Services';
  public dpsuservatnumber = '987654321000';
  private ltkn: LoginToken = new LoginToken();
  public returnUrl: string;
  public returnaddcustomerUrl: string;

  constructor(
    private router: Router, private logger: LoggingService, public customerListsService: CustomerListsService
    // tslint:disable-next-line: align // Adal Login Start
    , private msalService: MsalService
    // Adal Login end
  ) {
    this.logger.logF('environment.production :: ' + environment.production);
    // Adal Login Start
    console.log('App.Component');
    // this.msalService.login();
    this.returnUrl = './dashboard';
    this.returnaddcustomerUrl = './customer/add';
    /*
    const token = this.adalSvc.acquireToken(environment.aadurl).subscribe((token: string) => {
      this.logger.logF(token);
      this.ltkn.isLoggedIn = this.adalSvc.isAuthenticated;
      this.ltkn.accessToken = token;
      this.ltkn.userName = this.adalSvc.LoggedInUserName;
      this.ltkn.userEmail = this.adalSvc.LoggedInUserEmail;
      this.ltkn.userRole = this.adalSvc.userInfo.profile;
      this.getUserInfo(token, this.adalSvc.LoggedInUserEmail);
    });
    // Adal Login End
    */
  }

  getUserInfo(token: string, UserEmail: string) {

    this.customerListsService.getCustomersbyUserEmail(UserEmail).subscribe(customersList => {
      this.logger.log('authLogin in customersList Found ::', customersList);
      let customers: CustomersList[] = [];
      // if (this.ltkn.dpsUser.userRole === 'DPSAdmin') {
      customers = customersList.filter(c => c.item1 !== this.dpsuservatnumber);
      // } else {
      //  customers = customersList;
      // }

      if (customers.length > 0) {
        this.logger.logF('Logged in successfully. Please wait...');
        this.ltkn.customerVatNumber = customers[0].item1;
        this.ltkn.customerName = customers[0].item2;
        this.ltkn.customerlogo = customers[0].item4 !== undefined ? customers[0].item4 + '' : '';
        localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));

        this.logger.log('authLogin in customers Selected ::', customers[0].item2);
        this.logger.log('Selected customerVatNumber::', this.ltkn.customerVatNumber);
        this.logger.log('Selected customerName::', this.ltkn.customerName);
        this.logger.log(this.constructor.name + ' - ' + 'Redirect... this.returnUrl', this.returnUrl);
        this.router.navigate([this.returnUrl]);
      } else {
        this.logger.logF('Logged in successfully, but customers not found. Please wait...');
        localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
        this.logger.log(this.constructor.name + ' - ' + 'Redirect... this.returnaddcustomerUrl' + this.returnaddcustomerUrl);
        this.router.navigate([this.returnaddcustomerUrl]);
      }
    }, error => this.logger.logF(error));
  }
}

/*
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

, adalSvc: MsAdalAngular6Service
=====
*/