import { Injectable } from '@angular/core';

import * as Msal from 'msal';
import { environment } from '../../environments/environment';

declare var bootbox: '';
@Injectable({ providedIn: 'root' })

export class MsalService {

  B2CTodoAccessTokenKey = 'b2c.access.token';
  public AccessURL = environment.aadurl;  // 'https://login.microsoftonline.com/tfp/';

  tenantConfig = {
    tenant: environment.tenantid,
    clientID: environment.clientId,
    signInPolicy: '',
    signUpPolicy: '',
    redirectUri: 'http://localhost:4200',
    b2cScopes: ['https://' + environment.tenantid + '/access-api/user_impersonation']
  };

  // Configure the authority for Azure AD B2C
  authority = this.AccessURL + '/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signInPolicy;

  /* B2C SignIn SignUp Policy Configuration */
  clientApplication = new Msal.UserAgentApplication(this.tenantConfig.clientID, this.authority,
    (errorDesc: any, token: any, error: any, tokenType: any) => { });

  public login(): void {
    this.clientApplication.authority = this.AccessURL + '/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signInPolicy;
    this.authenticate();
  }

  public signup(): void {
    this.clientApplication.authority = this.AccessURL + '/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signUpPolicy;
    this.authenticate();
  }

  public authenticate(): void {
    let _this = this;
    this.clientApplication.loginPopup(this.tenantConfig.b2cScopes).then((idToken: any) => {
      _this.clientApplication.acquireTokenSilent(_this.tenantConfig.b2cScopes).then(
        (accessToken: any) => {
          _this.saveAccessTokenToCache(accessToken);
        }, (error: any) => {
          _this.clientApplication.acquireTokenPopup(_this.tenantConfig.b2cScopes).then((accessToken: any) => {
            _this.saveAccessTokenToCache(accessToken);
          }, (error: any) => { console.log('error: ', error); });
        });
    }, (error: any) => { console.log('error: ', error); });
  }

  saveAccessTokenToCache(accessToken: string): void { sessionStorage.setItem(this.B2CTodoAccessTokenKey, accessToken); }

  logout(): void { this.clientApplication.logout(); }

  isLoggedIn(): boolean { return this.clientApplication.getUser() != null; }

  getUserEmail(): string { /* return this.getUser().idToken.emails[0];*/ return this.getUser().idToken.toString(); }

  getUser() { return this.clientApplication.getUser(); }

}
