
import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';
import { CustomerListsService } from './shared/customerlists.service';
import { AADUserGroupService } from './shared/a-aduser-group.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as Msal from 'msal';
import { MsalService } from './shared/msal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomersList, LoginToken, AADUserGroups, UserGroups } from './shared/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = environment.DPSCustomerName;
  dpsuservatnumber = environment.DPSVATNumber;
  dpsLoginToken: LoginToken = new LoginToken();
  private maindata: AADUserGroups;
  private maindatausergroups: UserGroups[];
  constructor(
    private router: Router, private location: Location, private msalService: MsalService,
    private logger: LoggingService, private customerListsService: CustomerListsService, private aadUserGroupService: AADUserGroupService
  ) {

    const pathString = location.path().replace('/', '');
    const dpsLoginTokenString = localStorage.getItem('dpsLoginToken');

    if (dpsLoginTokenString === '' || dpsLoginTokenString === null || dpsLoginTokenString === undefined) {
      if (environment.B2C !== '' && this.msalService.isLoggedIn()) {
        const idToken = this.msalService.getIdToken();
        if (idToken !== '' || idToken !== null || idToken !== undefined) {
          this.msalService.getGroupDetails(idToken);
        } else {
          this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
        }
      } else {
        this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
      }
    } else {
      if (pathString === '') { this.router.navigate(['./' + environment.logInSuccessURL]); }
    }
    if (pathString !== environment.B2C + environment.logInRedirectURL &&
      pathString !== environment.B2CSuccess + environment.logInRedirectURL) {
    }
  }
  ngOnInit() { this.logger.showSpinner(); setTimeout(() => { this.logger.hideSpinner(); }, 3000); }
}
