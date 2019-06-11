import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Customer, DPSCustomer, LoginToken, DpsUser } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { LoginComponent } from '../../login/login.component';
import { CustomerListsService } from '../../../shared/customerlists.service';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UpdateCustomerComponent implements OnInit {

  public loginaccessToken: string = localStorage.getItem('accesstoken');
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));
  public dpsCustomer: any;
  public vatNumber: string;
  public CustomerName = '';
  public CustomerLogo = '';
  public currentPage = '';
  public Id = '';

  public editCustomerData: any;

  constructor(// private routerEvent: RouterEvent,
    private customerListsService: CustomerListsService, private snackBar: MatSnackBar,
    private router: Router, private activeRoute: ActivatedRoute) { this.validateLogin(); }

  validateLogin() {
    try {
      console.log('this.loginaccessToken :: ' + this.loginaccessToken);
      if (this.loginaccessToken === null || this.loginaccessToken === '' || this.loginaccessToken === undefined) {
        this.router.navigate(['/login']);
      }
    } catch (e) {
      this.router.navigate(['/login']); alert(e.message);
    }
  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      console.log('Snackbar Action :: ' + Action);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onPageInit();
  }

  ngOnInit() {
    this.onPageInit();
  }

  onPageInit() {
    this.activeRoute.params.subscribe((routeParams: any) => {
      console.log('routeParams :: ', routeParams);
      this.Id = routeParams.id;
      this.currentPage = routeParams.page;
      console.log('this.Id  :: ', this.Id, 'this.currentPage :: ', this.currentPage);

      if (this.Id === 'locations' || this.Id === 'location' || this.Id === 'positions' || this.Id === 'position' ||
        this.Id === 'users' || this.Id === 'user' || this.Id === 'workschedules' || this.Id === 'works' || this.Id === 'work' ||
        this.Id === 'update' || this.Id === 'updatecustomer' || this.Id === 'edit' || this.Id === 'editcustomer') {
        this.vatNumber = this.loginuserdetails.customerVatNumber;

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
      console.log('ID :: ' + this.Id, 'CurrentPage :: ' + this.currentPage);
    });
  }

  GetCustomerInfo(mode: number) {
    try {
      console.log('this.vatNumber pageInit :: ' + this.vatNumber);
      this.customerListsService.getCustomers().subscribe(dpscustomer => {
        this.dpsCustomer = dpscustomer.filter(cl => cl.item1 === this.vatNumber)[0];
        console.log('Customer Form Data : ', this.dpsCustomer);
        this.CustomerName = this.dpsCustomer.item2 + '';
        this.CustomerLogo = this.dpsCustomer.item4 !== undefined ? this.dpsCustomer.item4 + '' : '';
        if (mode === 1) { this.updateLocalStorage(); }
        this.ShowMessage('Customer fetched successfully. ' + this.CustomerName, '');
      }, error => this.ShowMessage(error, 'error'));
    } catch (e) {
      this.CustomerName = 'Error!!';
    }
  }

  updateLocalStorage() {
    console.log('updateLocalStorage :: ');
    this.loginuserdetails.customerVatNumber = this.vatNumber;
    console.log('lsDPUser :: ', this.loginuserdetails);
    localStorage.setItem('dpsuser', JSON.stringify(this.loginuserdetails));
    localStorage.setItem('customerName', this.CustomerName);
    localStorage.setItem('customerlogo', this.CustomerLogo);

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
    console.log('received editCustomerData in update customer=');
    this.editCustomerData = $event;
    console.log(this.editCustomerData);
  }

  onFormwardClick() {
    console.log('forward click', this.editCustomerData);
    if (this.editCustomerData.formValid !== null) {
      delete this.editCustomerData.formValid;
    }

    if (this.editCustomerData !== undefined && this.editCustomerData !== null && this.editCustomerData !== '') {
      this.customerService.createCustomerUpdate(this.editCustomerData).subscribe(res => {
        console.log('response=' + res);
        this.ShowMessage("Customer Data Saved successfully. ", '');
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Error occured=' + err.error.message);
            this.ShowMessage("" + err.error.message, '');
          } else {
            console.log('response code=' + err.status, 'response body=' + err.error);
            this.ShowMessage("" + err.status + "" + err.error, '');
          }
        }
      );
    }
  }
}
