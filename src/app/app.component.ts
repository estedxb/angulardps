
import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';
import { Login, DPSCustomer, DpsUser, LoginToken, CustomersList } from './shared/models';
import { Router, CanActivate } from '@angular/router';
import { CustomerListsService } from './shared/customerlists.service';
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
    // , private msalService: MsalService
  ) {
    this.logger.logF('environment.production :: ' + environment.production);
    // Adal Login Start
    console.log('App.Component');
    // this.login();
    this.returnUrl = './dashboard';
    this.returnaddcustomerUrl = './customer/add';

  }
/*
  useremail() {
    const useremail = this.msalService.getUserEmail();
    return useremail;
  }

  login() { this.msalService.login(); }

  signup() { this.msalService.signup(); }

  logout() { this.msalService.logout(); }

  isUserLoggedIn() { return this.msalService.isLoggedIn(); }

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
  */
}
