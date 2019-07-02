import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../../shared/customers.service';
import { LoggingService } from '../../shared/logging.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';
import { LoginToken } from 'src/app/shared/models';
import { PlatformLocation } from '@angular/common';

import { NgxUiLoaderService } from 'ngx-ui-loader';
// import * as Msal from 'msal';
// import { MsalServiceLocal } from '../../shared/msal.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() SelectedPage: string;
  @Input() CustomerVatNumber: string;
  public dpsLoginToken: LoginToken = new LoginToken();
  public VatNumber: string;
  public isDpsUser = false;
  public DPSVATNumber = environment.DPSVATNumber;
  constructor(
    private router: Router,
    platformLocation: PlatformLocation,
    private logger: LoggingService,
    // private spinner: NgxUiLoaderService
    // private msalService: MsalServiceLocal,
    // public authService: AuthService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => { this.onPageInit(); }, 750);
  }

  ngOnInit() { }

  onPageInit() {
    const dpsLoginTokenString = localStorage.getItem('dpsLoginToken');
    if (dpsLoginTokenString !== '' && dpsLoginTokenString !== null && dpsLoginTokenString !== undefined) {
      this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
      // alert(this.dpsLoginToken);
      this.VatNumber = this.dpsLoginToken.customerVatNumber;
      this.isDpsUser = this.dpsLoginToken.userRole === 'DPSAdmin' ? true : false;
    }
  }
  logout(): void {
    this.logger.log('Logout');
    this.logger.log(this.constructor.name + ' - ' + 'Redirect... Logout');
    localStorage.removeItem('dpsLoginToken');
    this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    // this.msalService.logout();
  }
}
