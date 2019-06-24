import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { environment } from '../../environments/environment';
import { LoginToken, CustomersList } from './models';

import { LoggingService } from './logging.service';
import { CustomerListsService } from './customerlists.service';


declare var bootbox: '';
@Injectable({
  providedIn: 'root'
})
export class MsalServiceLocal {
  private ltkn: LoginToken = new LoginToken();
  public message: string;
  public dpsuservatnumber = '987654321000';
  public errorMsg: string;

  public clientApplicationPR: Msal.UserAgentApplication;
  public Options = {
    validateAuthority: true,
    cacheLocation: 'sessionStorage',
    redirectUri: environment.webUrl + environment.B2CSuccess + environment.logInRedirectURL,
    isAngular: true
  };

  B2CTodoAccessTokenKey = environment.B2CTodoAccessTokenKey;

  public b2cScopes = ['https://' + environment.tenantid + '/' + environment.name + '/user_impersonation'];

  // Configure the authority for Azure AD B2C
  authority = 'https://login.microsoftonline.com/tfp/' + environment.tenantid + '/' + environment.signInPolicy;

  clientApplication = new Msal.UserAgentApplication(environment.clientId, this.authority, this.authCallback, this.Options);

  constructor(private customerListsService: CustomerListsService, private logger: LoggingService) { }

  private authCallback(errorDesc: any, token: any, error: any, tokenType: any): void {
    alert(token);
    this.saveAccessTokenToCache(token);
    if (token) {
      localStorage.setItem('dpsuseraccesstoken', token);
      this.logger.log('getAccesstoken :: ', this.getAuthenticationToken());
      alert('isLoggedIn :: ' + this.isLoggedIn());
      this.getAuthenticationToken();
      this.updateSessionStorage(token);
      alert(token);
    } else {
      // console.log(`${error} - ${errorDesc}`);
      if (errorDesc.indexOf('AADB2C90118') > -1) {
        // Forgotten password
        this.clientApplicationPR = new Msal.UserAgentApplication(
          environment.clientId,
          `https://login.microsoftonline.com/tfp/${environment.tenantid}/${environment.forgotPasswordPolicy}`,
          this.authCallback,
          {
            cacheLocation: 'localStorage',
            redirectUri: environment.webUrl + environment.B2CSuccess + environment.logInRedirectURL
          });
        this.clientApplicationPR.loginRedirect(this.b2cScopes);
      } else if (errorDesc.indexOf('AADB2C90077') > -1) {
        // Expired Token
        this.clientApplication.acquireTokenRedirect(this.b2cScopes);
      }
    }
  }

  saveAccessTokenToCache(accessToken: string): void {
    sessionStorage.setItem(this.B2CTodoAccessTokenKey, accessToken);
  }

  getAuthenticationToken(): Promise<string> {
    return this.clientApplication.acquireTokenSilent(this.b2cScopes)
      .then(token => {
        console.log('Got silent access token: ', token);
        return token;
      }).catch(error => {
        console.log('Could not silently retrieve token from storage.', error);
        return this.clientApplication.acquireTokenPopup(this.b2cScopes)
          .then(token => {
            console.log('Got popup access token: ', token);
            return token;
          }).catch(error => {
            console.log('Could not retrieve token from popup.', error);
            this.clientApplication.acquireTokenRedirect(this.b2cScopes);
            return Promise.resolve('');
          });
      });
  }

  public login(): void {
    this.clientApplication.authority = 'https://login.microsoftonline.com/tfp/' + environment.tenantid + '/' + environment.signInPolicy;
    this.authenticate();
  }

  public signup(): void {
    this.clientApplication.authority = 'https://login.microsoftonline.com/tfp/' + environment.tenantid + '/' + environment.signUpPolicy;
    this.authenticate();
  }

  public authenticate(): void {
    this.logger.log('authenticate() - this.clientApplication.authority :: ' + this.clientApplication.authority);
    this.logger.log('this.b2cScopes :: ' + this.b2cScopes);
    this.clientApplication.loginRedirect(this.b2cScopes);

  }
  updateSessionStorage(token: string) {
    // alert(this.getUser());
    alert('0');
    console.log('Azure getUser()', this.getUser());
    this.ltkn.accessToken = token;
    this.ltkn.isLoggedIn = true;
    this.ltkn.userEmail = this.getUserEmail();
    this.ltkn.userName = this.getUser().name;

    if (this.ltkn.userEmail.toLowerCase().includes('jobfixers.be') ||
      this.ltkn.userEmail.toLowerCase().includes('balaji') ||
      this.ltkn.userEmail.toLowerCase().includes('hass')) {
      this.ltkn.userRole = 'DPSAdmin';
      this.ltkn.customerName = 'Digital Payroll Services';
    } else {
      this.ltkn.userRole = 'Customer';
    }
    alert('1');
    this.customerListsService.getCustomersbyUserEmail(this.ltkn.userEmail, token).subscribe(customersList => {
      this.logger.log('authLogin in customersList Found ::', customersList);
      let customers: CustomersList[] = [];

      // if (this.ltkn.userRole === 'DPSAdmin') {
      customers = customersList.filter(c => c.item1 !== this.dpsuservatnumber);
      // } else { customers = customersList; }
      alert('2');
      if (customers.length > 0) {
        this.message = 'Logged in successfully. Please wait...';
        this.logger.log('Selected Customer', customers[0]);
        this.ltkn.customerVatNumber = customers[0].item1;
        this.ltkn.customerName = customers[0].item2;
        this.ltkn.customerlogo = customers[0].item4 !== undefined ? customers[0].item4 + '' : '';
        localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
        this.logger.log('1) authLogin in ::', this.ltkn);
        alert('3');
      }
    }, error => this.errorMsg = error);
    alert('4');
  }

  logout(): void { localStorage.removeItem('dpsLoginToken'); this.clientApplication.logout(); }

  isLoggedIn(): boolean { return this.clientApplication.getUser() != null; }

  getUserEmail(): string { return this.getUser().idToken['emails'][0]; } // idToken['emails'][0];

  getUser() { return this.clientApplication.getUser(); }

}



/*
let _this = this;
_this.clientApplication.loginPopup(this.b2cScopes).then(function (idToken: any) {
  _this.clientApplication.acquireTokenSilent(_this.b2cScopes).then(
    function (accessToken: any) {
      _this.saveAccessTokenToCache(accessToken);
      this.updateSessionStorage(accessToken);
    }, function (error: any) {
      _this.clientApplication.acquireTokenPopup(_this.b2cScopes).then(
        function (accessToken: any) {
          _this.saveAccessTokenToCache(accessToken);
          this.updateSessionStorage(accessToken);
        }, function (error: any) {
          console.log('error: ', error);
        });
    });
}, function (error: any) {
  console.log('error: ', error);
});
*/

    // postLogoutRedirectUri: environment.webUrl + environment.B2C + environment.logOutRedirectURL,
    // logger: loggerCallback,
    // loadFrameTimeout: 1000,
    // navigateToLoginRequestUrl: false,
    // state : '',
