
import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

/*
import * as Msal from 'msal';
import { MsalServiceLocal } from './shared/msal.service';
*/


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = environment.DPSCustomerName;

  constructor(
    private router: Router,
    private location: Location,
    private spinner: NgxUiLoaderService,
    // private msalService: MsalServiceLocal,
    private logger: LoggingService) {

    this.logger.logF('environment.production :: ' + environment.production);
    const pathString = location.path().replace('/', '');

    const dpsLoginTokenString = localStorage.getItem('dpsLoginToken');
    if (pathString !== environment.B2C + environment.logInRedirectURL &&
      pathString !== environment.B2CSuccess + environment.logInRedirectURL) {
      if (dpsLoginTokenString === '' || dpsLoginTokenString === null || dpsLoginTokenString === undefined) {
        this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
      } else {
        if (pathString === '') { this.router.navigate(['./' + environment.logInSuccessURL]); }
      }
    }
  }
  ngOnInit() {
    this.spinner.start();
    setTimeout(() => { this.spinner.stop(); }, 3000);
  }

  /*
  getUserInfo(token: string, UserEmail: string) {

    this.customerListsService.getCustomersbyUserEmail(UserEmail).subscribe(customersList => {
      this.logger.log('authLogin in customersList Found ::', customersList);
      let customers: CustomersList[] = [];
      // if (this.ltkn.dpsUser.userRole === 'DPSAdmin') {
      customers = customersList.filter(c => c.vatnumber !== this.dpsuservatnumber);
      // } else {
      //  customers = customersList;
      // }

      if (customers.length > 0) {
        this.logger.logF('Logged in successfully. Please wait...');
        this.ltkn.customerVatNumber = customers[0].vatnumber;
        this.ltkn.customerName = customers[0].name;
        this.ltkn.customerlogo = customers[0].logo !== undefined ? customers[0].logo + '' : '';
        localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));

        this.logger.log('authLogin in customers Selected ::', customers[0].name);
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
