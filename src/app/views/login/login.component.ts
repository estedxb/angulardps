import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login, DPSCustomer, DpsUser, LoginToken, CustomersList } from '../../shared/models';
import { Router } from '@angular/router';
// import { CustomersService } from '../../shared/customers.service';
import { UsersService } from '../../shared/users.service';
import { CustomerListsService } from '../../shared/customerlists.service';
import { environment } from '../../../environments/environment';
import { LoggingService } from '../../shared/logging.service';
import { Subscription } from 'rxjs/Subscription';
// import * as Msal from 'msal';
// import { MsalServiceLocal } from '../../shared/msal.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string;
  dpsuservatnumber = environment.DPSVATNumber;
  errorMsg: string;
  private ltkn: LoginToken = new LoginToken();
  public currentpage = 'login';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userService: UsersService,
    // public customersService: CustomersService,
    public customerListsService: CustomerListsService,
    // private msalService: MsalServiceLocal,
    private spinner: NgxSpinnerService,
    private logger: LoggingService
  ) { }

  ngOnInit() {
    // this.logger.log('msalConfig ', this.msalConfig);

    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required], password: ['', Validators.required]
    });
    this.logout();
  }

  // convenience getter for easy access to form fields
  get fctrls() { return this.loginForm.controls; }

  ShowForgotPassword() { this.currentpage = 'forgotpassword'; }

  ShowLogin() { this.currentpage = 'login'; }

  forgotpassword() { return true; }

  logout(): void {
    this.logger.log('Logout');
    localStorage.removeItem('dpsLoginToken');
    // this.msalService.logout();
    this.logger.log(this.constructor.name + ' - ' + 'Redirect... Logout');
  }

  login() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.message = 'Please enter username and password'; return;
    } else {

      // DPS Default Login this should be removed after B2C login 
      if (this.fctrls.userid.value === 'DPS@Uid#2019') { this.fctrls.userid.setValue('DPS@2019.Uid'); }

      if (this.fctrls.userid.value === 'DPS@2019.Uid' && this.fctrls.password.value === 'DPS@Pwd#2019') {
        this.ltkn.userRole = 'DPSAdmin';
      } else if (this.fctrls.userid.value === 'Cus@Uid#2019' && this.fctrls.password.value === 'Cus@Pwd#2019') {
        this.ltkn.userRole = 'Customer';
      } else { this.ltkn.userRole = 'Invalid'; }

      if (this.ltkn.userRole === 'DPSAdmin' || this.ltkn.userRole === 'Customer') {

        this.ltkn.userEmail = this.fctrls.userid.value;
        this.ltkn.isLoggedIn = true;
        this.ltkn.accessToken = this.generateAccessToken();

        if (this.ltkn.userRole === 'DPSAdmin') {
          this.ltkn.customerVatNumber = this.dpsuservatnumber;
          this.ltkn.customerName = 'Digital Payroll Services';
          this.ltkn.customerlogo = '';
          this.message = 'Logged in successfully, but customers not found. Please wait...';
          localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
          this.logger.log('2) authLogin in ::', this.ltkn);
          this.logger.log('Redirect Breaked 3');
          this.router.navigate(['./' + environment.logInSuccessNoCustomerURL]);
        } else {
          // Getting the CustomerList for the Login Email
          this.customerListsService.getCustomersbyUserEmail(this.ltkn.userEmail, 'token').subscribe(customersList => {
            this.logger.log('authLogin in customersList Found ::', customersList);

            if (customersList.length > 0) {
              const FirstCustomer: CustomersList = customersList[0];
              this.logger.log('Selected Customer', FirstCustomer);
              this.message = 'Logged in successfully. Please wait...';

              this.ltkn.customerVatNumber = FirstCustomer.vatNumber;
              this.ltkn.customerName = FirstCustomer.name;
              this.ltkn.customerlogo = FirstCustomer.logo !== undefined ? FirstCustomer.logo + '' : '';

              localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
              this.logger.log('1) authLogin in ::', this.ltkn);
              this.router.navigate(['./' + environment.logInSuccessURL]);
            } else {
              this.message = 'Error: Login failed. Please enter a valid login 1'; return;
            }
          }, error => this.errorMsg = error);
        }
      } else {
        this.message = 'Please enter username and password'; return;
      }
    }
  }
  generateAccessToken() {
    return 'Login-Access-Token';
  }
}


// for Real Login
/*
this.authService.verifyLogin(this.fctrls.userid.value, this.fctrls.password.value)
  .subscribe(data => {
    this.ltkn = data;
    this.logger.log('authLogin in authLogin.component ::');
    this.logger.log(data);
    if (this.ltkn !== null) {
      if (this.ltkn.accessToken !== '') {
        this.message = 'Logged in success please wait...';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('accesstoken', this.ltkn.accessToken);
        localStorage.setItem('customerName', this.ltkn.customerName);
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



/*
this.authService.verifyLogin(this.fctrls.userid.value, this.fctrls.password.value)
  .subscribe(data => {
    this.ltkn = data;
    this.logger.log('authLogin in authLogin.component ::');
    this.logger.log(data);
    if (this.ltkn !== null) {
      if (this.ltkn.accessToken !== '') {
        this.message = 'Logged in success please wait...';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('accesstoken', this.ltkn.accessToken);

        this.ltkn.dpsUser = FirstUser;
        this.logger.log('authLogin in Login User ::', this.ltkn.dpsUser);
        if (this.fctrls.userid.value === 'admin' && this.fctrls.password.value === 'admin') {
          this.ltkn.dpsUser.userRole = 'DPSAdmin';
        }
        if (this.ltkn.dpsUser === null) {
          this.ltkn.dpsUser.userRole = 'Customer';
        }

        this.logger.log('authLogin in Login User Role ::', this.ltkn.dpsUser.userRole);

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
