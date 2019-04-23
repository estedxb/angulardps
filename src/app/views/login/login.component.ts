import { Component, OnInit } from '@angular/core';
import { DPSCustomer, DpsUser } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public LoginCustomer: DPSCustomer = null;
  public LoginUser: DpsUser= null;
  constructor() { }

  ngOnInit() {

  }

}
