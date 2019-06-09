import { Component, OnInit } from '@angular/core';
import { User, DpsUser, LoginToken } from 'src/app/shared/models';
import * as $ from 'jquery';
import { PlatformLocation } from '@angular/common';
@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  public currentUser: DpsUser;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  public isDpsUser: boolean = this.loginuserdetails.userRole === 'DPSAdmin' ? true : false;
  public customerLogo = '../../assets/img/customer/logo/' + this.VatNumber + '.png';
  public isLogoFound: boolean = false;
  public customerName = 'JobFIXers';
  public clogoInit = 'JF';
  public platformLocation: string = '';
  constructor(platformLocation: PlatformLocation) {
    this.platformLocation = (platformLocation as any).location.origin;
    console.log('HeadersComponent this.platformLocation :: ' + this.platformLocation);
  }

  ngOnInit() {
    this.islogoVaild();
  }
  islogoVaild() {
    try {
      console.log('islogoVaild this.platformLocation :: ' + this.customerLogo);
      /*
      const fileExists = require('file-exists');
      fileExists.exists(this.customerLogo).then(exists => {
        console.log(this.customerLogo + ' islogoVaild exists? ' + exists);
        this.isLogoFound = true;
      });
      */
    } catch (e) {
      console.log('islogoVaild Error !!' + e.message);
      this.isLogoFound = false;
    }
  }
}
