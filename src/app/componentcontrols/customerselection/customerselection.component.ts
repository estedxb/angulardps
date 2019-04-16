import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CustomerListsService } from '../../shared/customerlists.service';
import { CustomersService } from '../../shared/customers.service';

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
   constructor(private customerLists: CustomerListsService) { }
  // constructor(private customerLists: CustomersService) { }


  oncustomerKeyup(value) {
    this.customernames = [];
    if (this.customers.length > 0) {
      this.customernames = this.customers
        .map( cust => { if (cust.name.toLowerCase().indexOf(value.toLowerCase()) > -1) { return cust; } } );
    } else {
      this.customernames = this.customers;
    }
  }

  ngOnInit() {
    this.customerLists.getCustomers()
        .subscribe( data => {
          this.customers = data;
          this.customernames = data;
          console.log('getCustomers ::');
          console.log(data);
        }, error => this.errorMsg = error );
  }

  ShowHideCustomerList() { this.show = !this.show; }

  closeMe() { this.show = false; }

}

