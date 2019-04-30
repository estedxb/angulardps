import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactpersonComponent } from '../../../contactperson/contactperson.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  public CustomerName = 'SB Graphics bvba';
  public currentPage = 'editcustomer';
  public Id = '';

  public editCustomerData: any;

  constructor(private customerService: CustomersService, private route: ActivatedRoute) {
    const sub = this.route.params.subscribe((params: any) => {
      this.Id = params.id;
      console.log('ID :: ' + this.Id);
    });

  }

  ngOnInit() {
    if (this.Id === 'locations' || this.Id === 'positions' || this.Id === 'update' ||
      this.Id === 'positions' || this.Id === 'users' || this.Id === 'workschedules') {
      this.currentPage = this.Id;
    } else {
      this.currentPage = 'editcustomer';
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
