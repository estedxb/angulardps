import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../../shared/logging.service';
import { Subscription } from 'rxjs/Subscription';
// import * as Msal from 'msal';
// import { MsalServiceLocal } from '../../shared/msal.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    // private msalService: MsalServiceLocal,
    // private spinner: NgxUiLoaderService,
    private logger: LoggingService) { }

  ngOnInit() {
    this.logout();
  }

  logout(): void {
    this.logger.log('Logout');
    // this.msalService.logout();
    this.logger.log(this.constructor.name + ' - ' + 'Redirect... Logout');
  }

}
