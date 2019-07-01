import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Customer, DPSCustomer, LoginToken, DpsUser } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { LoginComponent } from '../../login/login.component';
import { CustomerListsService } from '../../../shared/customerlists.service';
import { LoggingService } from '../../../shared/logging.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  public SelectedPage = 'UpdateCustomer';
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public loginaccessToken: string = this.dpsLoginToken.accessToken;
  public dpsCustomer: any;
  public vatNumber: string;
  public CustomerName = '';
  public CustomerLogo = '';
  public currentPage = '';
  public Id = '';

  public editCustomerData: any;

  constructor(// private routerEvent: RouterEvent,
    private customerListsService: CustomerListsService, private customerService: CustomersService,
    private snackBar: MatSnackBar, private logger: LoggingService,
    // private spinner: NgxUiLoaderService,
    private router: Router, private activeRoute: ActivatedRoute) { this.validateLogin(); }

  validateLogin() {
    try {
      this.logger.log('this.loginaccessToken :: ' + this.loginaccessToken);
      if (this.loginaccessToken === null || this.loginaccessToken === '' || this.loginaccessToken === undefined) {
        this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
        this.logger.log('Redirect Breaked 6');
        this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
      }
    } catch (e) {
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
      this.logger.log('Redirect Breaked 5');
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }
  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      this.logger.log('Snackbar Action :: ' + Action);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onPageInit();
  }

  ngOnInit() {

    this.onPageInit();
  }

  onPageInit() {

    this.spinner.start();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
       this.spinner.stop();
    }, 1000);

    // this.setTimeout(() => {
    //   this.spinner.hide();
    // }, 1000);

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
      this.customerListsService.getCustomers().subscribe(dpscustomer => {
        this.dpsCustomer = dpscustomer.filter(cl => cl.item1 === this.vatNumber)[0];
        this.logger.log('Customer Form Data : ', this.dpsCustomer);
        this.CustomerName = this.dpsCustomer.item2 + '';
        this.CustomerLogo = this.dpsCustomer.item4 !== undefined ? this.dpsCustomer.item4 + '' : '';
        if (mode === 1) { this.updateLocalStorage(); }
        //this.ShowMessage('Customer fetched successfully. ' + this.CustomerName, '');
      }, error => this.ShowMessage(error, 'error'));
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

    // this.logger.log("received customer data=");
    // this.logger.log(this.editCustomerData);

  }

  onFormwardClick() {
    this.logger.log('forward click', this.editCustomerData);

     this.spinner.start();

    setTimeout(() => {
       this.spinner.stop();
    }, 5000);


    if (this.editCustomerData.formValid === false) {
      this.ShowMessage('Onjuiste vermeldingen in formulier! ', '');
      return;
    }

    if (this.editCustomerData.formValid !== null) {
      delete this.editCustomerData.formValid;
    }

    if (this.editCustomerData !== undefined && this.editCustomerData !== null && this.editCustomerData !== '') {
      this.customerService.createCustomerUpdate(this.editCustomerData).subscribe(res => {
        this.ShowMessage('Customer Data Saved successfully. ', '');
        this.logger.log('response=' + res);
        this.ShowMessage('Customer Data Saved successfully. ', '');
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.logger.log('Error occured=' + err.error.message);
            this.ShowMessage('' + err.error.message, '');
          } else {
            this.logger.log('response code=' + err.status, 'response body=' + err.error);
            this.ShowMessage('' + err.status + '' + err.error, '');
          }
        }
      );
    }
  }
}
