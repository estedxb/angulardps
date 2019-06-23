import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login, DPSCustomer, DpsUser, LoginToken, CustomersList } from '../../shared/models';
import { Router, CanActivate } from '@angular/router';
// import { AuthService } from '../../shared/auth.service';
import { CustomersService } from '../../shared/customers.service';
import { UsersService } from '../../shared/users.service';
import { CustomerListsService } from '../../shared/customerlists.service';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';
import { LoggingService } from '../../shared/logging.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string;
  dpsuservatnumber = '987654321000';
  errorMsg: string;
  private ltkn: LoginToken = new LoginToken();
  public currentpage = 'login';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userService: UsersService,
    public customersService: CustomersService,
    public customerListsService: CustomerListsService,
    private appComp: AppComponent,
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
  get f() { return this.loginForm.controls; }

  ShowForgotPassword() { this.currentpage = 'forgotpassword'; }

  ShowLogin() { this.currentpage = 'login'; }

  forgotpassword() { return true; }

  logout(): void {
    this.logger.log('Logout');
    localStorage.removeItem('dpsLoginToken');
    // this.appComp.logout();
    this.logger.log(this.constructor.name + ' - ' + 'Redirect... Logout');
  }

  B2CLogin() {
    this.appComp.login();
  }

  login() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.message = 'Please enter username and password'; return;
    } else {
      // Loading Now the First DpsUser from First DpsCustomer for Testing....
      this.userService.getUsersByVatNumber(this.dpsuservatnumber).subscribe(usersList => {
        this.logger.log('authLogin in usersList Found ::', usersList);
        const FirstUser: DpsUser = usersList[0];
        this.logger.log('authLogin in Selected User ::', FirstUser);

        this.ltkn.accessToken = 'Login-Access-Token';
        this.ltkn.isLoggedIn = true;
        this.ltkn.userRole = FirstUser.userRole;
        this.ltkn.userName = FirstUser.user.firstName;
        this.ltkn.userEmail = FirstUser.user.email.emailAddress;
        if (FirstUser.customerVatNumber === '987654321000') {
          this.ltkn.customerName = 'DPS';
        } else {
          this.ltkn.customerName = FirstUser.customerVatNumber;
        }
        this.ltkn.customerVatNumber = FirstUser.customerVatNumber;

        if (this.f.userid.value.toLowerCase() === 'admin' && this.f.password.value.toLowerCase() === 'admin') {
          this.ltkn.userRole = 'DPSAdmin';
        } else { this.ltkn.userRole = 'Customer'; }

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
              // this.router.navigate(['./' + environment.logInSuccessURL]);
            } else {
              this.message = 'Logged in successfully, but customers not found. Please wait...';
              localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
              this.logger.log('2) authLogin in ::', this.ltkn);
              // this.router.navigate(['./' + environment.logInSuccessNoCustomerURL]);
            }
          }, error => this.errorMsg = error);
        } else {
          localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
          this.logger.log('3) authLogin in ::', this.ltkn);
          // this.router.navigate(['./' + environment.logInSuccessURL]);
        }
      }, error => this.errorMsg = error);
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
