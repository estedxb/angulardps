import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Customer, DPSCustomer, LoginToken, DpsUser } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { LoginComponent } from '../../login/login.component';

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
  public currentPage = '';
  public Id = '';

  public editCustomerData: any;

  constructor(// private routerEvent: RouterEvent,
    private customerService: CustomersService, private snackBar: MatSnackBar,
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

  ngOnInit() {
    this.activeRoute.params.subscribe((routeParams: any) => {
      console.log('routeParams :: ', routeParams);
      this.Id = routeParams.id; this.currentPage = routeParams.page;
      console.log('this.Id  :: ', this.Id, 'this.currentPage :: ', this.currentPage);

      if (this.Id === 'locations' || this.Id === 'positions' || this.Id === 'users' ||
        this.Id === 'workschedules' || this.Id === 'update' || this.Id === 'edit') {
        if (this.Id === 'update' || this.Id === 'edit') {
          this.currentPage = 'editcustomer';
        } else {
          this.currentPage = this.Id;
        }
        this.vatNumber = this.loginuserdetails.customerVatNumber;
      } else {
        this.vatNumber = this.Id;
        if (this.currentPage === undefined) {
          this.currentPage = 'editcustomer';
        }
      }
      console.log('ID :: ' + this.Id, 'CurrentPage :: ' + this.currentPage);
      this.onPageInit();
    });
  }

  onPageInit() {
    try {
      console.log('this.vatNumber pageInit :: ' + this.vatNumber);
      this.customerService.getCustomersByVatNumber(this.vatNumber).subscribe(dpscustomer => {
        this.dpsCustomer = dpscustomer;
        console.log('Customer Form Data : ', this.dpsCustomer);
        this.CustomerName = this.dpsCustomer.customer.name;
        this.ShowMessage('Customer fetched successfully. ' + this.CustomerName, '');
      }, error => this.ShowMessage(error, 'error'));
    } catch (e) {
      this.CustomerName = 'Error!!';
    }
  }

  receiveEditCustomerData($event) {
    console.log('received data in update customer=');
    this.editCustomerData = $event;
  }

  onFormwardClick() {
    console.log('forward click', this.editCustomerData);
    if (this.editCustomerData.formValid !== null) {
      delete this.editCustomerData.formValid;
    }

    if (this.editCustomerData !== undefined && this.editCustomerData !== null && this.editCustomerData !== '') {
      this.customerService.createCustomerUpdate(this.editCustomerData).subscribe(res => {
        console.log('response=' + res);
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Error occured=' + err.error.message);
          } else {
            console.log('response code=' + err.status, 'response body=' + err.error);
          }
        }
      );
    }
  }
}
