import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { environment } from '../../environments/environment';
import { LoginToken, CustomersList } from './models';
import { UsersService } from './users.service';
import { LoggingService } from './logging.service';
import { CustomerListsService } from './customerlists.service';

declare var bootbox: '';
@Injectable({
  providedIn: 'root'
})
export class MsalService {
  private ltkn: LoginToken = new LoginToken();
  message: string;
  returnUrl: string;
  returnaddcustomerUrl: string;
  dpsuservatnumber = '987654321000';
  VatNumber = '';
  errorMsg: string;
  public currentpage = 'login';

  public logInRedirectURL = 'validateLogin';
  B2CTodoAccessTokenKey = environment.B2CTodoAccessTokenKey;

  tenantConfig = {
    tenant: environment.tenantid,
    clientID: environment.clientId,
    signInPolicy: environment.signInPolicy,
    signUpPolicy: environment.signUpPolicy,
    forgotPasswordPolicy: environment.forgotPasswordPolicy,
    redirectUri: 'http://localhost:4200',
    b2cScopes: ['https://' + environment.tenantid + '/' + environment.name + '/user_impersonation']
  };
  constructor(private userService: UsersService, private customerListsService: CustomerListsService, private logger: LoggingService) { }
  // Configure the authority for Azure AD B2C
  authority = 'https://login.microsoftonline.com/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signInPolicy;

  /*
   * B2C SignIn SignUp Policy Configuration
   */
  clientApplication = new Msal.UserAgentApplication(
    this.tenantConfig.clientID, this.authority,
    function (errorDesc: any, token: any, error: any, tokenType: any) {
      //if (errorDesc !== '' && errorDesc !== undefined && errorDesc !== null) {
      alert('token :: ' + token);
      this.saveAccessTokenToCache(token);

      this.updateSessionStorage(token);
      // } else {
      //   alert('Error : ' + errorDesc);
      //   console.log('error: ', errorDesc);
      // }
    }
  );

  updateSessionStorage(token: string) {
    // alert(this.getUser());
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

    this.customerListsService.getCustomersbyUserEmail(this.ltkn.userEmail, token).subscribe(customersList => {
      this.logger.log('authLogin in customersList Found ::', customersList);
      let customers: CustomersList[] = [];

      // if (this.ltkn.userRole === 'DPSAdmin') {
      customers = customersList.filter(c => c.item1 !== this.dpsuservatnumber);
      // } else { customers = customersList; }

      if (customers.length > 0) {
        this.message = 'Logged in successfully. Please wait...';
        this.logger.log('Selected Customer', customers[0]);
        this.ltkn.customerVatNumber = customers[0].item1;
        this.ltkn.customerName = customers[0].item2;
        this.ltkn.customerlogo = customers[0].item4 !== undefined ? customers[0].item4 + '' : '';
        localStorage.setItem('dpsLoginToken', JSON.stringify(this.ltkn));
        this.logger.log('1) authLogin in ::', this.ltkn);
      }
    }, error => this.errorMsg = error);

  }

  public login(): void {
    this.clientApplication.authority = 'https://login.microsoftonline.com/tfp/' + this.tenantConfig.tenant + '/' +
      this.tenantConfig.signInPolicy;
    this.authenticate();
  }

  public signup(): void {
    this.clientApplication.authority = 'https://login.microsoftonline.com/tfp/' + this.tenantConfig.tenant + '/' +
      this.tenantConfig.signUpPolicy;
    this.authenticate();
  }

  public authenticate(): void {
    let _this = this;
    _this.clientApplication.loginRedirect(this.tenantConfig.b2cScopes);
    /*
    this.clientApplication.loginPopup(this.tenantConfig.b2cScopes).then(function (idToken: any) {
      _this.clientApplication.acquireTokenSilent(_this.tenantConfig.b2cScopes).then(
        function (accessToken: any) {
          _this.saveAccessTokenToCache(accessToken);
        }, function (error: any) {
          _this.clientApplication.acquireTokenPopup(_this.tenantConfig.b2cScopes).then(
            function (accessToken: any) {
              _this.saveAccessTokenToCache(accessToken);
            }, function (error: any) {
              console.log('error: ', error);
            });
        });
    }, function (error: any) {
      console.log('error: ', error);
    });
    */
  }

  saveAccessTokenToCache(accessToken: string): void {
    sessionStorage.setItem(this.B2CTodoAccessTokenKey, accessToken);
  }

  logout(): void {
    localStorage.removeItem('dpsLoginToken');
    this.clientApplication.logout();
  }

  isLoggedIn(): boolean {
    return this.clientApplication.getUser() != null;
  }

  getUserEmail(): string {
    return this.getUser().idToken['emails'][0];
  }

  getUser() {
    return this.clientApplication.getUser();
  }

  ForgotPassword() {
    this.clientApplication.authority = 'https://login.microsoftonline.com/tfp/' + this.tenantConfig.tenant + '/' +
      this.tenantConfig.forgotPasswordPolicy;
    this.clientApplication.loginRedirect(this.tenantConfig.b2cScopes);
  }

}
