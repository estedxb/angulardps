import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { DpsUser, LoginToken } from 'src/app/shared/models';
import { PlatformLocation } from '@angular/common';
import $ from 'jquery';
import { LoggingService } from '../../shared/logging.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  @Input() CustomerVatNumber: string;
  @Input() customerName: string;
  public currentUser: DpsUser;
  public dpsLoginToken: LoginToken = new LoginToken();
  public VatNumber: string;
  public isDpsUser = false;
  public customerLogoFileName = '';
  public customerLogo = '';
  public isLogoFound = false;
  public clogoInit = '';
  public platformLocation: string = '';
  public errorMsg;

  constructor(
    platformLocation: PlatformLocation,
    private logger: LoggingService
  ) {
    this.platformLocation = (platformLocation as any).location.origin;
    this.logger.log('HeadersComponent this.platformLocation :: ' + this.platformLocation);
  }

  ngOnChanges(changes: SimpleChanges): void { this.ngOnInit(); }

  ngOnInit() {
    const dpsLoginTokenString = localStorage.getItem('dpsLoginToken');
    if (dpsLoginTokenString !== '' && dpsLoginTokenString !== null && dpsLoginTokenString !== undefined) {
      this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
      // alert(this.dpsLoginToken);
      this.VatNumber = this.dpsLoginToken.customerVatNumber;
      this.isDpsUser = this.dpsLoginToken.userRole === 'DPSAdmin' ? true : false;
      this.onPageInit();
    }
  }

  getInit(FullName) {
    const FullNameSplit: string[] = FullName.split(' ');
    let result = '';
    if (FullName.length > 0) {
      if (FullNameSplit.length > 1 && FullNameSplit[0].length > 0 && FullNameSplit[FullNameSplit.length - 1].length > 0) {
        result = FullNameSplit[0].substring(0, 1) + FullNameSplit[FullNameSplit.length - 1].substring(0, 1);
      } else { result = FullName.substring(0, 2); }
    } else { result = FullName; }
    return result.toUpperCase();
  }

  onPageInit() {
    try {

      this.logger.log('islogoVaild this.platformLocation :: ' + this.customerLogo);

      this.customerLogoFileName = this.dpsLoginToken.customerlogo;

      if (this.customerLogoFileName !== undefined && this.customerLogoFileName !== '' && this.customerLogoFileName !== null) {
        this.customerLogo = '../../assets/img/customer/logo/' + this.customerLogoFileName;
        this.isLogoFound = true;
        this.logger.log('isLogoFound True');
      } else {
        this.customerLogo = '';
        this.isLogoFound = false;
        this.logger.log('isLogoFound False');
      }

      this.customerName = this.dpsLoginToken.customerName;
      this.clogoInit = this.getInit(this.customerName);

      /*
      $.ajax(
        {
          url: this.customerLogo,
          success: function (data, textStatus) {
            this.isLogoFound = true;
            this.logger.log('islogoVaild file exists');
            $('#customlogo').show();
            $('.clogoInit').hide();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            this.isLogoFound = false;
            this.logger.log('islogoVaild file does not exist');
            $('#customlogo').hide();
            $('.clogoInit').show();
          }
        }
      );
      */
    } catch (e) {
      this.logger.log('islogoVaild Error !!' + e.message);
      this.isLogoFound = false;
    }
  }
}
