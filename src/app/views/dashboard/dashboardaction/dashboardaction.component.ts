import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryService } from 'src/app/shared/summary.service';
import { environment } from '../../../../environments/environment';
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
  public loginaccessToken: string = localStorage.getItem('accesstoken');
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));
  public vatNumber: string;

  constructor(public summaryService: SummaryService, private router: Router) { }

  ngOnInit() {
    this.vatNumber = this.loginuserdetails.customerVatNumber; console.log('this.vatNumber : ' + this.vatNumber);
    this.summaryService.getSummaryByVatnumber(this.vatNumber).subscribe(summaries => {
      this.datas = summaries;
      this.notificationcount = summaries.length;
      console.log('Summaries Forms Data : ', this.datas);
    }, error => this.errorMsg = error);
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
    alert(reDirectURL);
    this.router.navigate([reDirectURL]);
  }

}
