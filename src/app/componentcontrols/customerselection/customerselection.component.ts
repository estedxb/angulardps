import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CustomerListsService } from '../../shared/customerlists.service';
import { User, DpsUser, LoginToken } from 'src/app/shared/models';
import { LoggingService } from '../../shared/logging.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

// import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-customerselection',
  templateUrl: './customerselection.component.html',
  styleUrls: ['./customerselection.component.css']
})

export class CustomerSelectionComponent implements OnInit {
  public currentUser: DpsUser;
  public dpsLoginToken: LoginToken = new LoginToken();
  public VatNumber: string;
  public isDpsUser = false;
  public customers = [];
  public customernames = [];
  public errorMsg;
  public show = false;
  constructor(
    private customerLists: CustomerListsService,
    private router: Router,
    // // private spinner: NgxUiLoaderService,
    private logger: LoggingService) { }

  oncustomerKeyup(value) {
    this.customernames = [];
    if (this.customers.length > 0) {
      this.customernames = this.customers
        .map(cust => { if (cust.name.toLowerCase().indexOf(value.toLowerCase()) > -1) { return cust; } });
    } else {
      this.customernames = this.customers;
    }
  }

  ngOnInit() {
    this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
    this.VatNumber = this.dpsLoginToken.customerVatNumber;
    this.isDpsUser = this.dpsLoginToken.userRole === 'DPSAdmin' ? true : false;
    this.customerLists.getCustomers()
      .subscribe(data => {
        this.customers = data;
        this.customernames = data;
        // this.logger.log('getCustomers in customerselection.component ::');
        // this.logger.log(data);
      }, error => this.errorMsg = error);
  }

  ShowHideCustomerList() {
    if (this.isDpsUser) {
      this.show = !this.show;
    }
  }

  addCustomer() {
    this.show = false;
    this.updateLocalStorage();
    this.router.navigate(['./customer/add']);
  }

  updateLocalStorage() {
    this.dpsLoginToken.customerVatNumber = environment.DPSVATNumber;
    this.dpsLoginToken.customerName = environment.DPSCustomerName;
    this.dpsLoginToken.customerlogo = '';
    localStorage.setItem('dpsLoginToken', JSON.stringify(this.dpsLoginToken));
    this.logger.log('dpsLoginToken :: ', this.dpsLoginToken);
  }

  closeMe() { this.show = false; }

}

