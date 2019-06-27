import { Component, OnInit } from '@angular/core';
import * as Msal from 'msal';
import { MsalServiceLocal } from '../shared/msal.service';
import { LoggingService } from '../shared/logging.service';
import { Router, ActivatedRoute, CanActivate } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-b2clogin',
  templateUrl: './b2clogin.component.html',
  styleUrls: ['./b2clogin.component.css']
})
export class B2cloginComponent implements OnInit {
  public id;
  public sub;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router, private msalService: MsalServiceLocal, private logger: LoggingService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.msalService.login();
    });
    /*
    if (!this.msalService.isLoggedIn()) {
      // alert('Not Logged-In == ' + this.msalService.isLoggedIn());
      this.msalService.login();
    } else {
      // alert('Already Logged-In ');
      console.log('getAuthenticationToken 2 :: ', this.msalService.getAuthenticationToken());
      // this.msalService.updateSessionStorage();
    }
    */
  }

}
