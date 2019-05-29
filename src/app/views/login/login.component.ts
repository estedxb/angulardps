import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login, DPSCustomer, DpsUser } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { LoginToken } from '../../shared/models';
import { CustomersService } from '../../shared/customers.service';
import { UsersService } from '../../shared/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string;
  returnUrl: string;
  errorMsg: string;
  private ltkn: LoginToken = new LoginToken();
  public currentpage = 'login';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService,
    public userService: UsersService,
    public customersService: CustomersService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = './dashboard';
    this.authService.logout();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  ShowForgotPassword() {
    this.currentpage = 'forgotpassword';
  }
  ShowLogin() {
    this.currentpage = 'login';
  }
  forgotpassword() {
    return true;
  }
  login() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.message = 'Please enter username and password'; return;
    } else {
      // for Real Login 
      /*
      this.authService.verifyLogin(this.f.userid.value, this.f.password.value)
        .subscribe(data => {
          this.ltkn = data;
          console.log('authLogin in authLogin.component ::');
          console.log(data);
          if (this.ltkn !== null) {
            if (this.ltkn.accessToken !== '') {
              this.message = 'Logged in success please wait...';
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('accesstoken', this.ltkn.accessToken);
              localStorage.setItem('dpsuser', JSON.stringify(this.ltkn.dpsUser));
              this.router.navigate([this.returnUrl]);
            } else {
              this.message = 'Please check your userid and password';
            }
          } else {
            this.message = 'Please check your userid and password';
          }
        }, error => this.errorMsg = error);
      */

      // Loading Now the First DpsUser from First DpsCustomer for Testing....
      this.customersService.getCustomers().subscribe(customersList => {
        console.log('authLogin in customersList Found ::', customersList);
        if (customersList.length > 0) {
          const FirstCustomer: DPSCustomer = customersList[0];
          console.log('authLogin in customers Selected ::', FirstCustomer);
          this.userService.getUsersByVatNumber(FirstCustomer.customer.vatNumber).subscribe(usersList => {
            console.log('authLogin in usersList Found ::', usersList);
            const FirstUser: DpsUser = usersList[0];
            console.log('authLogin in Selected User ::', FirstUser);
            this.authService.verifyLogin(this.f.userid.value, this.f.password.value)
              .subscribe(data => {
                this.ltkn = data;
                console.log('authLogin in authLogin.component ::');
                console.log(data);
                if (this.ltkn !== null) {
                  if (this.ltkn.accessToken !== '') {
                    this.message = 'Logged in success please wait...';
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('accesstoken', this.ltkn.accessToken);

                    this.ltkn.dpsUser = FirstUser;
                    console.log('authLogin in Login User ::', this.ltkn.dpsUser);
                    if (this.f.userid.value === 'admin' && this.f.password.value === 'admin') {
                      this.ltkn.dpsUser.userRole = 'DPSUser';
                    }
                    if (this.ltkn.dpsUser === null) {
                      this.ltkn.dpsUser.userRole = 'Customer';
                    }

                    console.log('authLogin in Login User Role ::', this.ltkn.dpsUser.userRole);

                    localStorage.setItem('dpsuser', JSON.stringify(this.ltkn.dpsUser));
                    this.router.navigate([this.returnUrl]);
                  } else {
                    this.message = 'Please check your userid and password';
                  }
                } else {
                  this.message = 'Please check your userid and password';
                }
              }, error => this.errorMsg = error);
          }, error => this.errorMsg = error);
        } else {
          this.message = 'Customers Not Found...';
        }
      }, error => this.errorMsg = error);
    }
  }
}

