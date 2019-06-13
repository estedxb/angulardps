
/* ==
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
== */

import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { LoggingService } from './shared/logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Digital Payroll Services';
  constructor(private logger: LoggingService) {
    this.logger.logF('environment.production :: ' + environment.production);
  }
  /* ==
  constructor(private adalSvc: MsAdalAngular6Service) {
    console.log(this.adalSvc.userInfo);
    const token = this.adalSvc.acquireToken('https://graph.microsoft.com').subscribe((token: string) => {
      console.log(token);
    });
  }
  == */
}
