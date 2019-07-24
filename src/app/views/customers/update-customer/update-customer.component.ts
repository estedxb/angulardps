import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Customer, DPSCustomer, LoginToken, DpsUser } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponent } from '../../login/login.component';
import { CustomerListsService } from '../../../shared/customerlists.service';
import { LoggingService } from '../../../shared/logging.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  public SelectedPage = 'UpdateCustomer';
  public dpsLoginToken: LoginToken = new LoginToken();
  public loginaccessToken = '';
  public dpsCustomer: any;
  public isDpsUser = false;
  public vatNumber = '';
  public userEmail = '';
  public CustomerName = '';
  public CustomerLogo = '';
  public currentPage = '';
  public Id = '';

  public editCustomerData: any;

  constructor(// private routerEvent: RouterEvent,
    private customerListsService: CustomerListsService, private customerService: CustomersService,
    private logger: LoggingService, private router: Router, private activeRoute: ActivatedRoute) {
    this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
    this.vatNumber = this.dpsLoginToken.customerVatNumber;
    this.userEmail = this.dpsLoginToken.userEmail;
    this.loginaccessToken = this.dpsLoginToken.accessToken;
    this.isDpsUser = this.dpsLoginToken.userRole === 'DPSAdmin' ? true : false;
    this.validateLogin();
  }

  validateLogin() {
    try {
      this.logger.log('this.loginaccessToken :: ' + this.loginaccessToken);
      if (this.loginaccessToken === null || this.loginaccessToken === '' || this.loginaccessToken === undefined) {
        this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
        this.logger.log('Redirect Breaked 6');
        this.logger.ShowMessage('Toegang geweigerd!', '');
        this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
      }
    } catch (e) {
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
      this.logger.log('Redirect Breaked 5');
      this.logger.ShowMessage('Toegang geweigerd!', '');
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onPageInit();
  }

  ngOnInit() {

    this.onPageInit();
  }

  onPageInit() {

    this.activeRoute.params.subscribe((routeParams: any) => {
      this.logger.log('routeParams :: ', routeParams);
      this.Id = routeParams.id;
      this.currentPage = routeParams.page;
      this.logger.log('this.Id  :: ', this.Id);
      this.logger.log('this.currentPage :: ', this.currentPage);

      if (this.Id === 'locations' || this.Id === 'location' || this.Id === 'positions' || this.Id === 'position' ||
        this.Id === 'users' || this.Id === 'user' || this.Id === 'workschedules' || this.Id === 'works' || this.Id === 'work' ||
        this.Id === 'update' || this.Id === 'updatecustomer' || this.Id === 'edit' || this.Id === 'editcustomer') {
        this.vatNumber = this.dpsLoginToken.customerVatNumber;

        if (this.Id === 'locations' || this.Id === 'location') {
          this.currentPage = 'locations';
        } else if (this.Id === 'users' || this.Id === 'user') {
          this.currentPage = 'users';
        } else if (this.Id === 'workschedules' || this.Id === 'works' || this.Id === 'work') {
          this.currentPage = 'workschedules';
        } else if (this.Id === 'positions' || this.Id === 'position') {
          this.currentPage = 'positions';
        } else {
          this.currentPage = 'editcustomer';
        }
        this.GetCustomerInfo(0);
      } else {
        this.vatNumber = this.Id;
        this.GetCustomerInfo(1);
      }
      this.logger.log('ID :: ' + this.Id, 'CurrentPage :: ' + this.currentPage);
    });
  }
  setTimeout(arg0: () => void, arg1: number) {
    throw new Error("Method not implemented.");
  }

  GetCustomerInfo(mode: number) {
    try {
      this.logger.log('this.vatNumber pageInit :: ' + this.vatNumber);
      if (this.isDpsUser) {
        this.customerListsService.getCustomers().subscribe(dpscustomer => {
          this.dpsCustomer = dpscustomer.filter(cl => cl.vatNumber === this.vatNumber);
          if (this.dpsCustomer !== null && this.dpsCustomer.length > 0) {
            this.logger.log('Customer Form Data : ', this.dpsCustomer[0]);
            this.CustomerName = this.dpsCustomer[0].name + '';
            this.CustomerLogo = this.dpsCustomer[0].logo !== undefined ? this.dpsCustomer[0].logo + '' : '';
            if (mode === 1) {
              this.updateLocalStorage();
            }
          } else {
            this.logger.ShowMessage('Toegang geweigerd!', '');
            this.logger.log('Redirect Breaked 4');
            this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
          }
        }, error => {
          this.logger.ShowMessage(error, 'error');
          this.logger.log('Redirect Breaked 2');
          this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
        });
      } else {
        this.customerListsService.getCustomersbyUserEmail(this.userEmail, this.loginaccessToken).subscribe(dpscustomer => {
          this.dpsCustomer = dpscustomer.filter(cl => cl.vatNumber === this.vatNumber);
          if (this.dpsCustomer !== null && this.dpsCustomer.length > 0) {
            this.logger.log('Customer Form Data : ', this.dpsCustomer[0]);
            this.CustomerName = this.dpsCustomer[0].name + '';
            this.CustomerLogo = this.dpsCustomer[0].logo !== undefined ? this.dpsCustomer[0].logo + '' : '';
            if (mode === 1) {
              this.updateLocalStorage();
            }
          } else {
            this.logger.ShowMessage('Toegang geweigerd!', '');
            this.logger.log('Redirect Breaked 3');
            this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
          }
        }, error => {
          this.logger.ShowMessage(error, 'error');
          this.logger.log('Redirect Breaked 1');
          this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
        });
      }

    } catch (e) {
      this.CustomerName = 'Error!!';
    }
  }

  updateLocalStorage() {
    this.logger.log('updateLocalStorage :: Vat = ' + this.vatNumber +
      ' :: CustomerName = ' + this.CustomerName + ' :: CustomerLogo = ' + this.CustomerLogo);
    this.dpsLoginToken.customerVatNumber = this.vatNumber;
    this.dpsLoginToken.customerName = this.CustomerName;
    this.dpsLoginToken.customerlogo = this.CustomerLogo;
    localStorage.setItem('dpsLoginToken', JSON.stringify(this.dpsLoginToken));
    this.logger.log('dpsLoginToken :: ', this.dpsLoginToken);

    if (
      this.currentPage === 'locations' || this.currentPage === 'location' || this.currentPage === 'positions' ||
      this.currentPage === 'position' || this.currentPage === 'users' || this.currentPage === 'user' ||
      this.currentPage === 'workschedules' || this.currentPage === 'works' || this.currentPage === 'work') {
      if (this.currentPage === 'locations' || this.currentPage === 'location') {
        this.currentPage = 'locations';
      } else if (this.currentPage === 'users' || this.currentPage === 'user') {
        this.currentPage = 'users';
      } else if (this.currentPage === 'workschedules' || this.currentPage === 'works' || this.currentPage === 'work') {
        this.currentPage = 'workschedules';
      } else if (this.currentPage === 'positions' || this.currentPage === 'position') {
        this.currentPage = 'positions';
      } else {
        this.currentPage = 'editcustomer';
      }
    } else {
      this.currentPage = 'editcustomer';
    }
  }
  receiveEditCustomerData($event) {
    this.editCustomerData = $event;
  }

  onFormwardClick() {
    this.logger.log('forward click', this.editCustomerData);

    if (this.editCustomerData.formValid === false) {
      this.logger.ShowMessage('Onjuiste vermeldingen in formulier! ', '');
      return;
    }

    if (this.editCustomerData.formValid !== null) {
      delete this.editCustomerData.formValid;
    }

    if (this.editCustomerData !== undefined && this.editCustomerData !== null && this.editCustomerData !== '') {
      this.customerService.createCustomerUpdate(this.editCustomerData).subscribe(res => {
        this.logger.ShowMessage('Klantgegevens succesvol opgeslagen', '');
        this.logger.log('response=' + res);
        this.logger.ShowMessage('Klantgegevens succesvol opgeslagen', '');
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.logger.log('Error occured=' + err.error.message);
            this.logger.ShowMessage('' + err.error.message, '');
          } else {
            this.logger.log('response code=' + err.status, 'response body=' + err.error);
            this.logger.ShowMessage('' + err.status + '' + err.error, '');
          }
        }
      );
    }
  }
}
