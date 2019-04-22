import { Component, OnInit } from '@angular/core';
import { Customer } from '../../shared/models';
import { CustomersService } from '../../shared/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  public dpscustomers = [];
  public errorMsg;
  constructor(private customersService: CustomersService) { console.log('CustomersComponent Init'); }

  ngOnInit() {
    this.customersService.getCustomers()
      .subscribe(data => {
        this.dpscustomers = data;
        console.log('DPS Customers in customers.component ::');
        console.log(data);
      },
        error => this.errorMsg = error);
  }

}
