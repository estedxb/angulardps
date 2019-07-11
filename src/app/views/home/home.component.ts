import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from '../../shared/logging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginToken } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public SelectedPage = 'Home';
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
