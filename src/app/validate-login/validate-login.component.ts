import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Msal from 'msal';
import { MsalService } from '../shared/msal.service';
import { LoggingService } from '../shared/logging.service';
import { LoginToken } from '../shared/models';
import { Router, CanActivate } from '@angular/router';


@Component({
  selector: 'app-validate-login',
  templateUrl: './validate-login.component.html',
  styleUrls: ['./validate-login.component.css']
})
export class ValidateLoginComponent implements OnInit {
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));

  constructor(private router: Router, private msalService: MsalService, private logger: LoggingService) { }

  ngOnInit() {
    if (!this.isUserLoggedIn) {
      this.login();
      // this.router.navigate(['./dashboard']);
    }
  }

  useremail() {
    const useremail = this.msalService.getUserEmail();
    return useremail;
  }

  login() {
    this.msalService.login();
  }

  signup() {
    this.msalService.signup();
  }

  logout() {
    this.msalService.logout();
  }

  isUserLoggedIn() {
    return this.msalService.isLoggedIn();
  }

}
