import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { DpsUser } from 'src/app/shared/models';
import { PlatformLocation } from '@angular/common';
import $ from 'jquery';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  @Input() CustomerVatNumber: string;
  @Input() customerName: string;
  public currentUser: DpsUser;
  public loginuserdetails: DpsUser = new DpsUser();
  public VatNumber: string;
  public isDpsUser = false;
  public customerLogo = '';
  public isLogoFound = false;
  // public customerName = '';
  public clogoInit = '';
  public platformLocation: string = '';
  public errorMsg;

  constructor(platformLocation: PlatformLocation) {
    this.platformLocation = (platformLocation as any).location.origin;
    console.log('HeadersComponent this.platformLocation :: ' + this.platformLocation);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.VatNumber = this.CustomerVatNumber;
    this.onPageInit();
  }

  ngOnInit() {
    this.loginuserdetails = JSON.parse(localStorage.getItem('dpsuser'));
    this.VatNumber = this.loginuserdetails.customerVatNumber;
    this.isDpsUser = this.loginuserdetails.userRole === 'DPSAdmin' ? true : false;
    // this.customerLogo = '../../assets/img/customer/logo/' + this.VatNumber + '.png';
    this.onPageInit();
  }

  getInit(FullName) {
    const FullNameSplit: string[] = FullName.split(' ');
    let result = '';
    if (FullName.length > 0) {
      if (FullNameSplit.length > 1 && FullNameSplit[0].length > 0 && FullNameSplit[FullNameSplit.length - 1].length > 0) {
        result = FullNameSplit[0].substring(0, 1) + FullNameSplit[FullNameSplit.length - 1].substring(0, 1);
      } else {
        result = FullName.substring(0, 2);
      }
    } else {
      result = FullName;
    }
    return result.toUpperCase();
  }

  onPageInit() {
    try {
      console.log('islogoVaild this.platformLocation :: ' + this.customerLogo);
      this.customerLogo = '../../assets/img/customer/logo/' + this.VatNumber + '.png';
      this.customerName = localStorage.getItem('customerName');
      this.clogoInit = this.getInit(this.customerName);

      $.ajax(
        {
          url: this.customerLogo,
          success: function (data, textStatus) {
            this.isLogoFound = true;
            console.log('islogoVaild file exists');
            $('#customlogo').show();
            $('.clogoInit').hide();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            this.isLogoFound = false;
            console.log('islogoVaild file does not exist');
            $('#customlogo').hide();
            $('.clogoInit').show();
          }
        });
    } catch (e) {
      console.log('islogoVaild Error !!' + e.message);
      this.isLogoFound = false;
    }
  }
}
