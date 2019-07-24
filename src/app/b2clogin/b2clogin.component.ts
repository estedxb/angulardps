import { Component, OnInit } from '@angular/core';
// import * as Msal from 'msal';
import { MsalService } from '../shared/msal.service';
import { LoggingService } from '../shared/logging.service';
import { Router, ActivatedRoute, CanActivate } from '@angular/router';



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
    private router: Router,
    private msalService: MsalService,
    private logger: LoggingService
  ) { }

  ngOnInit() {
    // this.activatedRoute.params.subscribe(params => { this.id = params['id']; });
    const loginstate: boolean = this.msalService.isLoggedIn();
    if (!loginstate) {
      this.msalService.loginRedirect();
    } else { this.msalService.getGroupDetails(this.msalService.getIdToken()); }
  }
}
