import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { CustomersService } from '../shared/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  public customers = [];
  public errorMsg;
  constructor(private customersService: CustomersService) { }

  ngOnInit() {
    this.customersService.getCustomers()
    .subscribe(data => this.customers = data,
              error => this.errorMsg = error);
 }

}
