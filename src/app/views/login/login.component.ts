import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login, DPSCustomer, DpsUser, LoginToken, CustomersList } from '../../shared/models';
import { Router } from '@angular/router';
import { CustomersService } from '../../shared/customers.service';
import { UsersService } from '../../shared/users.service';
import { CustomerListsService } from '../../shared/customerlists.service';
import { environment } from '../../../environments/environment';
import { LoggingService } from '../../shared/logging.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';
// import * as Msal from 'msal';
// import { MsalServiceLocal } from '../../shared/msal.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
    public customersService: CustomersService,
    public customerListsService: CustomerListsService,
    private snackBar: MatSnackBar,
    // private msalService: MsalServiceLocal,
    // private spinner: NgxUiLoaderService,
    private logger: LoggingService
  ) { }

  ngOnInit() {
    // this.logger.log('msalConfig ', this.msalConfig);

    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required], password: ['', Validators.required]
    });
    this.logout();
  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      this.logger.log('Snackbar Action :: ' + Action);
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

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
      if (this.f.userid.value === 'DPS@Uid#2019' && this.f.password.value === 'DPS@Pwd#2019') {
        this.ltkn.userRole = 'DPSAdmin';
      } else if (this.f.userid.value === 'Cus@Uid#2019' && this.f.password.value === 'Cus@Pwd#2019') {
        this.ltkn.userRole = 'Customer';
      } else {
        this.ltkn.userRole = 'Invalid';
      }

      if (this.ltkn.userRole === 'DPSAdmin' || this.ltkn.userRole === 'Customer') {

        this.customersService.getCustomers().subscribe(customersList => {
          // Loading Now the First DpsUser from First DpsCustomer for Testing....
          this.userService.getUsersByVatNumber(customersList[0].customer.vatNumber).subscribe(usersList => {
            this.logmein(usersList);
          }, error => { this.ShowMessage(error, ''); this.errorMsg = error; this.logmein(null); });
        }, error => { this.ShowMessage(error, ''); this.errorMsg = error; this.logmein(null); });
      } else {
        this.message = 'Please enter username and password'; return;
      }
    }
  }
  logmein(usersList: DpsUser[]) {
    this.logger.log('authLogin in usersList Found ::', usersList);
    const FirstUser: DpsUser = usersList[0];
    this.logger.log('authLogin in Selected User ::', FirstUser);

    this.ltkn.accessToken = 'Login-Access-Token';
    this.ltkn.isLoggedIn = true;
    // this.ltkn.userRole = FirstUser.userRole;
    this.ltkn.userName = FirstUser.user.firstName;
    this.ltkn.userEmail = FirstUser.user.email.emailAddress;
    if (FirstUser.customerVatNumber === environment.DPSVATNumber) {
      this.ltkn.customerName = 'DPS';
    } else {
      this.ltkn.customerName = FirstUser.customerVatNumber;
    }
    this.ltkn.customerVatNumber = FirstUser.customerVatNumber;

    /*
    if (this.f.userid.value === 'DPS@Uid#2019' && this.f.password.value === 'DPS@Pwd#2019') {
      this.ltkn.userRole = 'DPSAdmin';
    } else { this.ltkn.userRole = 'Customer'; }
    */

    if (this.ltkn.customerVatNumber === this.dpsuservatnumber) {
      this.customerListsService.getCustomersbyUserEmail(this.ltkn.userEmail, 'token').subscribe(customersList => {
        this.logger.log('authLogin in customersList Found ::', customersList);
        let customers: CustomersList[] = [];

        if (this.ltkn.userRole === 'DPSAdmin') {
          customers = customersList.filter(c => c.item1 !== this.dpsuservatnumber);
        } else { customers = customersList; }

        if (customers.length > 0) {
          this.message = 'Logged in successfully. Please wait...';
          this.logger.log('Selected Customer', customers[0]);
          this.ltkn.customerVatNumber = customers[0].item1;
          this.ltkn.customerName = customers[0].item2;
          this.ltkn.customerlogo = customers[0].item4 !== undefined ? customers[0].item4 + '' : '';
          localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
          this.logger.log('1) authLogin in ::', this.ltkn);
          this.logger.log('Redirect Breaked 4');
          this.router.navigate(['./' + environment.logInSuccessURL]);
        } else {
          this.message = 'Logged in successfully, but customers not found. Please wait...';
          localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
          this.logger.log('2) authLogin in ::', this.ltkn);
          this.logger.log('Redirect Breaked 3');
          this.router.navigate(['./' + environment.logInSuccessNoCustomerURL]);
        }
      }, error => this.errorMsg = error);
    } else {
      localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
      this.logger.log('3) authLogin in ::', this.ltkn);
      this.logger.log('Redirect Breaked 2');
      this.router.navigate(['./' + environment.logInSuccessURL]);
    }
  }
}


// for Real Login
/*
this.authService.verifyLogin(this.f.userid.value, this.f.password.value)
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
this.authService.verifyLogin(this.f.userid.value, this.f.password.value)
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
        if (this.f.userid.value === 'admin' && this.f.password.value === 'admin') {
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
