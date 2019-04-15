import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ICustomer } from '../models/customer';
import { CustomersService } from '../shared/customers.service';
import { CustomersComponent } from '../customers/customers.component';

@Component({
  selector: 'app-customerselection',
  templateUrl: './customerselection.component.html',
  styleUrls: ['./customerselection.component.css']
})
export class CustomerselectionComponent implements OnInit {
  public customers = [];
  public customernames = [];
  public errorMsg;
  public show = false;
  constructor(private customersService: CustomersService) { }
  values = '';

  oncustomerKeyup(value) {
        this.customernames = [];
        if (this.customers.length > 0) {
          this.customernames = this.customers
            .map( cust => { if (cust.customerName.toLowerCase().indexOf(value.toLowerCase()) > -1) { return cust; } } );
        } else {
          console.log('this.customers.length == 0');
          this.customernames = this.customers;
        }
        console.log('this.customernames::');
        console.log(this.customernames);
        // .filter(x=>{console.log(x.indexOf(value));return x.indexOf(value)>0})
        //     .subscribe(
        // (data)=>console.log(data),      (error)=>console.log('Error'+error),
        //       ()=>console.log('complete'));
  }

  ngOnInit() {
     this.customersService.getCustomers()
      .subscribe(data => {
          this.customers = data;
          this.customernames = data;
      }, error => this.errorMsg = error);
  }

  ShowHideCustomerList() {
    this.show = !this.show;
  }

  closeMe() {
    this.show = false;
  }
  AddCustomer() {
    alert('AddCustomer');
  }
}

