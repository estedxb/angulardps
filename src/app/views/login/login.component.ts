import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login, DPSCustomer, DpsUser } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { LoginToken } from '../../shared/models';
import { CustomersService } from '../../shared/customers.service';

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
    private formBuilder: FormBuilder, private router: Router, public authService: AuthService, public customerLists: CustomersService) { }

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
    if (this.loginForm.invalid) { this.message = 'Please enter username and password'; return; } else {
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

              if (this.f.userid.value === 'admin' && this.f.password.value === 'admin') {
                this.ltkn.dpsUser.userRole = 'DPSUser';
              } else {
                this.ltkn.dpsUser.userRole = 'Customer';
              }

              localStorage.setItem('dpsuser', JSON.stringify(this.ltkn.dpsUser));
              this.router.navigate([this.returnUrl]);
            } else {
              this.message = 'Please check your userid and password';
            }
          } else {
            this.message = 'Please check your userid and password';
          }
        }, error => this.errorMsg = error);
    }
  }
}

