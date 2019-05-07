import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Customer, DPSCustomer } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactPersonComponent } from '../../../contactperson/contactperson.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));
  public dpsCustomer: any;
  public vatNumber: string;
  public CustomerName = '';
  public currentPage = 'editcustomer';
  public Id = '';

  public editCustomerData: any;

  constructor(private customerService: CustomersService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    const sub = this.route.params.subscribe((params: any) => {
      this.Id = params.id;
      this.currentPage = params.page;
      console.log('ID :: ' + this.Id);
    });
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
    if (this.Id === 'locations' ||
      this.Id === 'positions' ||
      this.Id === 'users' ||
      this.Id === 'workschedules') {
      this.currentPage = this.Id;
      this.vatNumber = this.loginuserdetails.customerVatNumber;
    } else {
      this.currentPage = 'editcustomer';
      this.vatNumber = this.loginuserdetails.customerVatNumber;
    }
    try {
      console.log('this.vatNumber :: ' + this.vatNumber);
      this.customerService.getCustomersByVatNumber(this.vatNumber).subscribe(dpscustomer => {
        this.dpsCustomer = dpscustomer;
        console.log('Customer Form Data : ', this.dpsCustomer);
        this.CustomerName = this.dpsCustomer.customer.name;
        this.ShowMessage('Customer fetched successfully.', '');
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

    console.log('forward click');
    console.log(this.editCustomerData);

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
            console.log('response code=' + err.status);
            console.log('response body=' + err.error);
          }
        }
      );
    }

  }

}
