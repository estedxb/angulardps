
import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Digital Payroll Services';

  constructor(
    private router: Router,
    private location: Location,
    private logger: LoggingService) {
    this.logger.logF('environment.production :: ' + environment.production);
    const pathString = location.path().replace('/', '');

    const dpsLoginTokenString = localStorage.getItem('dpsLoginToken');
    if (pathString !== environment.B2C + environment.logInRedirectURL &&
      pathString !== environment.B2CSuccess + environment.logInRedirectURL) {
      if (dpsLoginTokenString === '' || dpsLoginTokenString === null || dpsLoginTokenString === undefined) {
        this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
      }
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
