import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { logging } from 'protractor';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';
import { AADUserGroupService } from './a-aduser-group.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AADUserGroups, UserGroups, LoginToken, CustomersList } from './models';
import { CustomerListsService } from './customerlists.service';
import { Router } from '@angular/router';

declare var bootbox: '';
@Injectable()
export class MsalService {

  // Configure the authority for Azure AD B2C
  authority = environment.aadurl + environment.tenantid + '/' + environment.signInPolicy;
  dpsuservatnumber = environment.DPSVATNumber;
  dpsLoginToken: LoginToken = new LoginToken();
  private maindata: AADUserGroups;
  private maindatausergroups: UserGroups[];

  constructor(
    private router: Router, private customerListsService: CustomerListsService,
    private aadUserGroupService: AADUserGroupService, private logger: LoggingService
  ) { }

  /* B2C SignIn SignUp Policy Configuration */
  clientApplication = new Msal.UserAgentApplication(environment.clientId, this.authority,
    (errorDesc: any, idToken: any, error: any, tokenType: any) => {
      if (error === '' || error === undefined || error === null) {
        console.log('idToken :: ', idToken);
        this.getGroupDetails(idToken);
      } else {
        console.log('clientApplication error 1: (' + environment.clientId + ',' + this.authority + ')', error, errorDesc);
        this.logger.ShowMessage('Login Failed', '');
      }
    }
  );

  loginRedirect(): void {
    this.clientApplication.authority = environment.aadurl + environment.tenantid + '/' + environment.signInPolicy;
    this.authenticateRedirect();
  }

  signupRedirect(): void {
    this.clientApplication.authority = environment.aadurl + environment.tenantid + '/' + environment.signUpPolicy;
    this.authenticateRedirect();
  }

  forgotRedirect(): void {
    this.clientApplication.authority = environment.aadurl + environment.tenantid + '/' + environment.forgotPasswordPolicy;
    this.authenticateRedirect();
  }

  authenticateRedirect(): void { this.clientApplication.loginRedirect(); }
  saveAccessTokenToCache(accessToken: string): void { sessionStorage.setItem(environment.B2CTodoAccessTokenKey, accessToken); }
  getAccessToken() { return sessionStorage.getItem('b2c.access.token'); }
  getIdToken() { return sessionStorage.getItem('msal.idtoken'); }
  getClientInfo() { return sessionStorage.getItem('msal.client.info'); }
  logout(): void { this.clientApplication.logout(); }
  isLoggedIn(): boolean { return this.clientApplication.getUser() != null; }
  getUserEmail(): string { return this.getUser().idToken['emails'][0]; }
  getUserName(): string { return this.getUser().idToken['name'][0]; }
  getOtherInfo(): string { return JSON.stringify(this.clientApplication.cacheLocation); }
  getUserState(): string { return this.clientApplication.getUserState(''); }
  getUserInfo(): string { return JSON.stringify(this.getUser()); }
  getUser() { return this.clientApplication.getUser(); }
  getUserId() { return this.getUser().idToken['oid']; }

  public getGroupDetails(idToken) {
    this.aadUserGroupService.getAADUserGroupDetails(idToken).subscribe(aadUserGroups => {
      this.logger.log('getGroupDetails response=', aadUserGroups);
      this.maindata = aadUserGroups;
      this.maindatausergroups = this.maindata.value;
      this.getUserDetails(idToken, this.getUserEmail(), this.getUserName());
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.logger.ShowMessage('Error! ' + err.error.message, '');
          this.logger.log('Error occured=' + err.error.message);
        } else {
          this.logger.log('response code=' + err.status);
          this.logger.log('response body=' + err.error);
        }
      }
    );
  }
  getUserDetails(token: string, UserEmail: string, UserName: string) {
    this.customerListsService.getCustomersbyUserEmail(UserEmail, token).subscribe(customersList => {
      this.logger.log('authLogin in customersList Found ::', customersList);
      let customers: CustomersList[] = [];

      this.dpsLoginToken.accessToken = token;
      this.dpsLoginToken.userName = UserName;
      this.dpsLoginToken.userEmail = UserEmail;

      if (this.maindatausergroups.length < 1) {
        this.dpsLoginToken.userRole = 'DPSCustomers';
      } else {
        this.dpsLoginToken.userRole = this.maindatausergroups[0].displayName;
      }
      if (this.dpsLoginToken.userRole === 'DPSAdmin') {
        customers = customersList.filter(c => c.vatNumber !== this.dpsuservatnumber);
      } else { customers = customersList; }

      if (customers.length > 0) {
        this.logger.logF('Logged in successfully. Please wait...');
        this.dpsLoginToken.customerVatNumber = customers[0].vatNumber;
        this.dpsLoginToken.customerName = customers[0].name;
        this.dpsLoginToken.customerlogo = customers[0].logo !== undefined ? customers[0].logo + '' : '';
        localStorage.setItem('dpsLoginToken', JSON.stringify(this.dpsLoginToken));

        this.logger.log('authLogin in customers Selected ::', customers[0].name);
        this.logger.log('Selected customerVatNumber::', this.dpsLoginToken.customerVatNumber);
        this.logger.log('Selected customerName::', this.dpsLoginToken.customerName);
      } else {
        this.logger.logF('Logged in successfully, but customers not found. Please select diffrent login...');
        localStorage.setItem('dpsLoginToken', JSON.stringify(this.dpsLoginToken));
      }
      this.router.navigate(['./' + environment.logInSuccessURL]);
    }, error => {
      this.logger.logF(error);
    }
    );
  }
}

