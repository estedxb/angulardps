import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DpsPerson, Person, LoginToken } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { LoggingService } from '../../shared/logging.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public SelectedPage = 'Dashboard';
  public notificationcount = 0;
  public currentPage = '';
  public Id = '';
  public data: any = '';
  public isForceZeroNotificationCount = false;
  public errorMsg;
  public dpsLoginToken: LoginToken = new LoginToken();
  public vatNumber: string = '';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private snackBar: MatSnackBar,
    // private spinner: NgxUiLoaderService,
    private logger: LoggingService) { }

  ngOnInit() {
    if (localStorage.getItem('dpsLoginToken') !== undefined &&
      localStorage.getItem('dpsLoginToken') !== '' &&
      localStorage.getItem('dpsLoginToken') !== null) {
      this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
      this.vatNumber = this.dpsLoginToken.customerVatNumber;
      const sub = this.route.params.subscribe((params: any) => {
        this.Id = params.id;
        this.currentPage = params.page;
        this.onPageInit();
      });
    } else {
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }
  }

  onPageInit() {
    if (this.currentPage !== undefined && this.currentPage !== null && this.currentPage !== '') {
      this.SelectedPage = 'Scheduler';
      this.isForceZeroNotificationCount = true;
      this.notificationcount = 0;
    }
  }

  setNotificationCount($event) {
    // alert('setNotificationCount(' + $event + ', ' + this.isForceZeroNotificationCount + ')');
    if (this.isForceZeroNotificationCount) {
      this.notificationcount = 0;
    } else {
      this.notificationcount = $event;
    }
  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      this.logger.log('Snackbar Action :: ' + Action);
    });
  }
}
