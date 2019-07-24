import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

import { Subscription } from 'rxjs/Subscription';
// import * as Msal from 'msal';
// import { MsalServiceLocal } from '../shared/msal.service';
import { LoggingService } from '../shared/logging.service';
import { DPSCustomer, DpsUser, LoginToken, CustomersList } from '../shared/models';
import { CustomerListsService } from '../shared/customerlists.service';
import { Router, CanActivate } from '@angular/router';


@Component({
  selector: 'app-validate-login',
  templateUrl: './validate-login.component.html',
  styleUrls: ['./validate-login.component.css']
})
export class ValidateLoginComponent implements OnInit {
  // public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public dpsuservatnumber = environment.DPSVATNumber;
  private ltkn: LoginToken = new LoginToken();
  private errorMsg = '';
  private message = '';
  public access_token = '';

  constructor(
    private router: Router,
    // private msalService: MsalServiceLocal, 
    public customerListsService: CustomerListsService, private logger: LoggingService
  ) { }

  ngOnInit() {
    /*
    if (this.getAccessTokenFromCache()) {
      // this.updateSessionStorage();
    } else { throw 'Access token does not exist for todo app.'; }
    */
  }

  /*
  getAccessTokenFromCache(): boolean {
    if (sessionStorage.hasOwnProperty(this.msalService.B2CTodoAccessTokenKey) &&
      sessionStorage[this.msalService.B2CTodoAccessTokenKey] !== '') {
      this.access_token = sessionStorage[this.msalService.B2CTodoAccessTokenKey];
      return true;
    }
    return false;
  }
*/
  /*
  public useremail() { return this.msalService.getUserEmail(); }
  public login() { this.msalService.login(); }
  public signup() { this.msalService.signup(); }
  public logout() { this.msalService.logout(); }
  public isUserLoggedIn() { return this.msalService.isLoggedIn(); }
  public getUser() { return this.msalService.getUser(); }
  public getUserEmail() { return this.msalService.getUserEmail(); }
  public getAuthenticationToken() { return this.msalService.getAuthenticationToken(); }

  updateSessionStorage() {
    try {
      alert('updateSessionStorage');
      console.log('Azure getUser()', this.getUser());
      this.ltkn.accessToken = this.access_token;
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
      this.customerListsService.getCustomersbyUserEmail(this.ltkn.userEmail, this.access_token).subscribe(customersList => {
        this.logger.log('authLogin in customersList Found ::', customersList);
        console.log('customersList :: ', customersList);
        let customers: CustomersList[] = [];

        // if (this.ltkn.userRole === 'DPSAdmin') {
        customers = customersList.filter(c => c.vatNumber !== this.dpsuservatnumber);
        // } else { customers = customersList; }

        console.log('customers :: ', customers);

        if (customers.length > 0) {
          this.message = 'Logged in successfully. Please wait...';
          this.logger.log('Selected Customer', customers[0]);
          this.ltkn.customerVatNumber = customers[0].vatNumber;
          this.ltkn.customerName = customers[0].name;
          this.ltkn.customerlogo = customers[0].logo !== undefined ? customers[0].logo + '' : '';
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
  */
}
