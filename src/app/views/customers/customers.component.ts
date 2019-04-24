import { Component, OnInit } from '@angular/core';
import { Customer, LoginToken } from '../../shared/models';
import { Router } from '@angular/router';
import { CustomersService } from '../../shared/customers.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  public ltkn: LoginToken;
  public dpscustomers = [];
  public errorMsg;

  constructor(private customersService: CustomersService, private router: Router, public authService: AuthService) {
    console.log('CustomersComponent Init');
  }

  ngOnInit() {
    try {
      this.customersService.getCustomers()
        .subscribe(data => {
          this.dpscustomers = data;
          console.log('DPS Customers in customers.component ::');
          console.log(data);
        }, error => this.errorMsg = error);

      const tkn: string = localStorage.getItem('token');
      if (tkn !== undefined && tkn !== '') {
        this.ltkn = JSON.parse(tkn);
      } else {
        this.router.navigate(['/login']);
      }
    } catch (e) {
      console.log('Error in Customer Component : ' + e.message);
    }
  }
}
