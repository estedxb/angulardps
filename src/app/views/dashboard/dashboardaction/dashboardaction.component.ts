import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryService } from 'src/app/shared/summary.service';
import { environment } from '../../../../environments/environment';
import { Summaries, LoginToken } from '../../../shared/models';
import { LoggingService } from '../../../shared/logging.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-dashboardsummary',
  templateUrl: './dashboardaction.component.html',
  styleUrls: ['./../dashboard.component.css']
})

export class DashboardActionComponent implements OnInit {
  public notificationcount = 0;
  public currentlanguage = 'nl';
  public errorMsg;
  public datas: any = [];
  public dpsLoginToken: LoginToken = new LoginToken();
  public loginaccessToken = '';
  public vatNumber: string;

  @Input() public isForceZeroNotificationCount;
  @Output() public NotificationCount = new EventEmitter();
  constructor(public summaryService: SummaryService, private router: Router, private spinner: NgxSpinnerService, private logger: LoggingService) { }

  ngOnInit() {
    this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
    this.vatNumber = this.dpsLoginToken.customerVatNumber;
    this.loginaccessToken = this.dpsLoginToken.accessToken;
    this.logger.log('DashboardActionComponent this.vatNumber : ' + this.vatNumber);
    this.summaryService.getSummaryByVatnumber(this.vatNumber).subscribe(summaries => {
      this.datas = summaries.filter(d => d.isFinished === false);
      if (this.isForceZeroNotificationCount) {
        this.notificationcount = 0;
      } else {
        this.notificationcount = this.datas.length;
        this.NotificationCount.emit(this.notificationcount);
      }
      this.logger.log('DashboardActionComponent Summaries Forms Data : ', this.datas);
      this.errorMsg = '';
    }, error => {
      this.logger.log('Error on ngOnInit while getSummaryByVatnumber(' + this.vatNumber + ') ::', error);
      this.errorMsg = 'Fout bij het ophalen van de behandeling.';
    });
  }

  goToAction(action: number, id: string, otherid: string) {
    let reDirectURL = '';
    if (action === 1) {
      reDirectURL = environment.actionURL_1;
    } else if (action === 2) {
      reDirectURL = environment.actionURL_2;
    } else if (action === 3) {
      reDirectURL = environment.actionURL_3;
    } else if (action === 4) {
      reDirectURL = environment.actionURL_4;
    } else if (action === 5) {
      reDirectURL = environment.actionURL_5;
    } else if (action === 6) {
      reDirectURL = environment.actionURL_6;
    } else if (action === 7) {
      reDirectURL = environment.actionURL_7;
    } else if (action === 8) {
      reDirectURL = environment.actionURL_8;
    } else if (action === 9) {
      reDirectURL = environment.actionURL_9;
    } else {
      reDirectURL = environment.actionURL_1;
    }
    reDirectURL = reDirectURL.replace('$id$', id);
    this.router.navigate([reDirectURL]);
  }

  updateAction(index: number) {
    const summaries: Summaries = this.datas[index];
    summaries.isFinished = true;
    this.summaryService.updateSummaryByVatnumberAndSummaryID(summaries).subscribe(data => {
      this.datas.splice(index, 1);
      // this.logger.log('DashboardActionComponent Summaries Update Action Finished : ', data, this.datas);
      this.errorMsg = '';
    }, error => {
      this.logger.log('Error while updateAction(' + index + ') ::', error);
      this.errorMsg = 'Fout tijdens het bijwerken van de behandeling.';
    });
  }

}
