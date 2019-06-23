import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private appComp: AppComponent,
    private logger: LoggingService) { }

  ngOnInit() {
    this.logout();
  }

  logout(): void {
    this.logger.log('Logout');
    this.appComp.logout();
    this.logger.log(this.constructor.name + ' - ' + 'Redirect... Logout');
  }

}
