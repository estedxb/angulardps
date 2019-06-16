import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private router: Router, private adal: MsAdalAngular6Service, private _zone: NgZone, private logger: LoggingService) { }

  ngOnInit() {
    this.adal.handleCallback();
    setTimeout(() => {
      this._zone.run(() => {
        this.logger.log(this.constructor.name + ' - ' + 'Redirect... dashboard');
        this.router.navigate(['/dashboard']);
      });
    }, 200);
  }

}
