import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CustomerListsService } from '../../shared/customerlists.service';
import { User, DpsUser, LoginToken } from 'src/app/shared/models';

@Component({
  selector: 'app-customerselection',
  templateUrl: './customerselection.component.html',
  styleUrls: ['./customerselection.component.css']
})

export class CustomerSelectionComponent implements OnInit {
  public currentUser: DpsUser;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  public isDpsUser: boolean = this.loginuserdetails.userRole === 'DPSAdmin' ? true : false;
  public customers = [];
  public customernames = [];
  public errorMsg;
  public show = false;
  constructor(private customerLists: CustomerListsService) { }

  oncustomerKeyup(value) {
    this.customernames = [];
    if (this.customers.length > 0) {
      this.customernames = this.customers
        .map(cust => { if (cust.item2.toLowerCase().indexOf(value.toLowerCase()) > -1) { return cust; } });
    } else {
      this.customernames = this.customers;
    }
  }

  ngOnInit() {
    this.customerLists.getCustomers()
      .subscribe(data => {
        this.customers = data;
        this.customernames = data;
        // console.log('getCustomers in customerselection.component ::');
        // console.log(data);
      }, error => this.errorMsg = error);
  }

  ShowHideCustomerList() {
    if (this.isDpsUser) {
      this.show = !this.show;
    }
  }

  closeMe() { this.show = false; }

}

