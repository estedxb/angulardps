import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../../shared/customers.service';

import { LoggingService } from '../../shared/logging.service';
import { Subscription } from 'rxjs/Subscription';

import * as Msal from 'msal';
import { MsalServiceLocal } from '../../shared/msal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() SelectedPage: string;
  constructor(private router: Router, private logger: LoggingService, private msalService: MsalServiceLocal
    //  , public authService: AuthService
  ) { }

  ngOnInit() { }

  logout(): void {
    this.logger.log('Logout');
    this.logger.log(this.constructor.name + ' - ' + 'Redirect... Logout');
    localStorage.removeItem('dpsLoginToken');
    this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    // this.msalService.logout();
  }
}
