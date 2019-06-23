
import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';
import { Login, DPSCustomer, DpsUser, LoginToken, CustomersList } from './shared/models';
import { Router, CanActivate } from '@angular/router';
import { CustomerListsService } from './shared/customerlists.service';
import { Subscription } from 'rxjs/Subscription';
import * as Msal from 'msal';
import { MsalService } from './shared/msal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Digital Payroll Services';
  public dpsuservatnumber = '987654321000';
  private ltkn: LoginToken = new LoginToken();
  private errorMsg = '';
  private message = '';

  constructor(
    private router: Router, public customerListsService: CustomerListsService,
    private msalService: MsalService, private logger: LoggingService) {
    this.logger.logF('environment.production :: ' + environment.production);

    if (!this.isUserLoggedIn()) {
      this.login();
    } else {
      const token: string = 'Token';  // this.getAccesstoken();
      try {
        const dpsLoginTokenString = localStorage.getItem('dpsLoginToken');
        if (dpsLoginTokenString !== '') {
          const dpsLoginToken: LoginToken = JSON.parse(dpsLoginTokenString);
          const VatNumber = dpsLoginToken.customerVatNumber;
          if (VatNumber === '') { this.updateSessionStorage(token); }
        } else { this.updateSessionStorage(token); }
      } catch (e) {
        this.logger.log('Getting dpsLoginToken failed', e.message);
        this.updateSessionStorage(token);
      }
    }
  }

  public useremail() {
    const useremail = this.msalService.getUserEmail();
    return useremail;
  }

  public login() {
    this.msalService.login();
  }

  public signup() {
    this.msalService.signup();
  }

  public logout() {

    this.msalService.logout();
    localStorage.removeItem('dpsLoginToken');
    // this.router.navigate(['/dashboard']);
  }

  public isUserLoggedIn() {
    return this.msalService.isLoggedIn();
  }

  public getUser() {
    return this.msalService.getUser();
  }
  public getUserEmail() {
    return this.msalService.getUserEmail();
  }

  public getAccesstoken() {
    // return this.msalService.
  }

  updateSessionStorage(token: string) {
    try {
      console.log('Azure getUser()', this.getUser());
      this.ltkn.accessToken = token;
      this.ltkn.isLoggedIn = true;
      this.ltkn.userEmail = this.getUserEmail();
      this.ltkn.userName = this.getUser().name;

      if (this.ltkn.userEmail.toLowerCase().includes('jobfixers.be') ||
        this.ltkn.userEmail.toLowerCase().includes('balaji') ||
        this.ltkn.userEmail.toLowerCase().includes('jannes') ||
        this.ltkn.userEmail.toLowerCase().includes('hass')) {
        this.ltkn.userRole = 'DPSAdmin';
        this.ltkn.customerName = 'Digital Payroll Services';
      } else {
        this.ltkn.userRole = 'Customer';
      }

      console.log('ltkn :: ', this.ltkn);
      this.customerListsService.getCustomersbyUserEmail(this.ltkn.userEmail, token).subscribe(customersList => {
        this.logger.log('authLogin in customersList Found ::', customersList);
        console.log('customersList :: ', customersList);
        let customers: CustomersList[] = [];

        // if (this.ltkn.userRole === 'DPSAdmin') {
        customers = customersList.filter(c => c.item1 !== this.dpsuservatnumber);
        // } else { customers = customersList; }

        console.log('customers :: ', customers);

        if (customers.length > 0) {
          this.message = 'Logged in successfully. Please wait...';
          this.logger.log('Selected Customer', customers[0]);
          this.ltkn.customerVatNumber = customers[0].item1;
          this.ltkn.customerName = customers[0].item2;
          this.ltkn.customerlogo = customers[0].item4 !== undefined ? customers[0].item4 + '' : '';
          localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
          this.logger.log('1) authLogin in ::', this.ltkn);
          this.router.navigate(['./dashboard']);
        }
      }, error => {
        this.errorMsg = error;
        this.logger.log('Get customerListsService Error :: ', this.errorMsg);
        alert('1) ' + this.errorMsg);
      });
    } catch (e) {
      this.errorMsg = e.message;
      this.logger.log('Get customerListsService Error :: ', this.errorMsg);
      alert('2) ' + this.errorMsg);
    }
  }


  /*
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
