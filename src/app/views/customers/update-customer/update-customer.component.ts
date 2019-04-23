import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactpersonComponent } from '../../../contactperson/contactperson.component';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  public CustomerName = 'SB Graphics bvba';
  public currentPage = "editcustomer";
  
  constructor(private customerService: CustomersService) { }

  ngOnInit() {
  }

}
