import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../../shared/customers.service';
// import { AuthService } from '../../shared/auth.service';
import { LoggingService } from '../../shared/logging.service';
import { Subscription } from 'rxjs/Subscription';
import { AppComponent } from '../../app.component';

import * as Msal from 'msal';
import { MsalService } from '../../shared/msal.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() SelectedPage: string;
  constructor(private router: Router, private appComp: AppComponent, private logger: LoggingService, private msalService: MsalService
    //  , public authService: AuthService
  ) { }
  ngOnInit() { }

  logout(): void {
    this.logger.log('Logout');
    this.logger.log(this.constructor.name + ' - ' + 'Redirect... Logout');
    this.appComp.logout();
  }
}
