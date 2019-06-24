import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

import { Subscription } from 'rxjs/Subscription';
import * as Msal from 'msal';
import { MsalService } from '../shared/msal.service';
import { LoggingService } from '../shared/logging.service';
import { Login, DPSCustomer, DpsUser, LoginToken, CustomersList } from '../shared/models';
import { CustomerListsService } from '../shared/customerlists.service';

import { Router, CanActivate } from '@angular/router';


@Component({
  selector: 'app-validate-login',
  templateUrl: './validate-login.component.html',
  styleUrls: ['./validate-login.component.css']
})
export class ValidateLoginComponent implements OnInit {
  // public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public dpsuservatnumber = '987654321000';
  private ltkn: LoginToken = new LoginToken();
  private errorMsg = '';
  private message = '';

  constructor(
    private router: Router, private msalService: MsalService,
    public customerListsService: CustomerListsService, private logger: LoggingService
  ) { }

  ngOnInit() {
    if (!this.isUserLoggedIn()) {
      // alert('Not Login');
      this.logger.log('this.isUserLoggedIn()', this.isUserLoggedIn());
      this.login();
    } else {
      // alert('Logged in');
      const dpsLoginTokenString = localStorage.getItem('dpsLoginToken');
      let token = this.getAccesstoken() + '';
      if ((dpsLoginTokenString !== '' && dpsLoginTokenString !== null && dpsLoginTokenString !== undefined) ||
        (token !== '' && token !== null && token !== undefined)) {
        console.log('dpsLoginTokenString :: ' + dpsLoginTokenString);
        const dpsLoginToken: LoginToken = JSON.parse(dpsLoginTokenString);
        console.log('dpsLoginTokenString ===', dpsLoginToken);
        const VatNumber = dpsLoginToken.customerVatNumber;
        if (VatNumber === '') { this.updateSessionStorage(token); }
      } else {
        this.login();
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
    return this.msalService.getAccessTokenToCache();
  }

  updateSessionStorage(token: string) {
    try {
      alert('updateSessionStorage');
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
          this.logger.log('Redirect Breaked 1');
          this.router.navigate(['./' + environment.logInSuccessURL]);
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

}
