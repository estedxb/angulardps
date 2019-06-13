import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private router: Router, private adal: MsAdalAngular6Service, private _zone: NgZone) { }

  ngOnInit() {
    this.adal.handleCallback();
    setTimeout(() => {
      this._zone.run(() => this.router.navigate(['/dashboard']));
    }, 200);
  }

}
