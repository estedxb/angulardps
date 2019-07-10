import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../../shared/logging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginToken } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public SelectedPage = 'Settings';
  public dpsLoginToken: LoginToken = new LoginToken();
  public vatNumber: string = '';
  constructor(
    private route: ActivatedRoute, private router: Router,
    private logger: LoggingService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('dpsLoginToken') !== undefined &&
      localStorage.getItem('dpsLoginToken') !== '' &&
      localStorage.getItem('dpsLoginToken') !== null) {
      this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
      this.vatNumber = this.dpsLoginToken.customerVatNumber;
    } else {
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }
  }

}
