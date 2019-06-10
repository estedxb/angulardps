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
  public currentUser: DpsUser;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  @Input() CustomerVatNumber: string;
  @Input() customerName: string;
  public VatNumber = this.loginuserdetails.customerVatNumber;
  public isDpsUser: boolean = this.loginuserdetails.userRole === 'DPSAdmin' ? true : false;
  public customerLogo = '../../assets/img/customer/logo/' + this.VatNumber + '.png';
  public isLogoFound: boolean = false;
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
    this.customerName = localStorage.getItem('customerName');
    this.loginuserdetails = JSON.parse(localStorage.getItem('dpsuser'));
    this.VatNumber = this.loginuserdetails.customerVatNumber;
    this.onPageInit();
  }

  onPageInit() {
    this.customerLogo = '../../assets/img/customer/logo/' + this.VatNumber + '.png';
    this.clogoInit = this.getInit(this.customerName);
    this.islogoVaild();
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
  islogoVaild() {
    try {
      console.log('islogoVaild this.platformLocation :: ' + this.customerLogo);
      /*
      fs.fileExists(this.customerLogo, (err, exists) => {
        console.log('islogoVaild stat Success');
        if (err == null) {
          this.isLogoFound = true;
          console.log(this.customerLogo + ' file exists');
        } else if (err.code === 'ENOENT') {
          this.isLogoFound = false;
          console.log(this.customerLogo + ' file does not exist');
        } else {
          this.isLogoFound = false;
          console.log('Some other error: ', err.code);
        }
      });
      */

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
