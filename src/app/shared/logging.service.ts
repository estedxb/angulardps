import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { getMinutes } from 'ngx-bootstrap/chronos/utils/date-getters';
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  public apiServer: any;
  public isRequireAuth = true;
  public isLoggingRequired = true;
  constructor() {
    try {
      // let appConfig: AppConfig = new AppConfig();
      this.apiServer = AppConfig.settings.apiServer;
      this.isRequireAuth = AppConfig.settings.aad.requireAuth;
      this.isLoggingRequired = AppConfig.settings.logging.console;
    } catch (e) {
      alert(e.message);
    }
  }

  ngOnInit(): void {


  }

  log(msg: any, data1: any = null, data2: any = null, data3: any = null) {
    const date = new Date();
    const dateString: string = '"' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
      + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes() + '"';
    console.log('this.isLoggingRequired :: ' + this.isLoggingRequired);
    if ((msg !== null || data1 !== null || data2 !== null || data3 !== null) && this.isLoggingRequired) {
      console.log(' ========= dateString - Start =========== ');
      if (msg !== null) {
        const msgstring = JSON.stringify(msg);
        if (msgstring !== '') { console.log(msgstring); }
      }
      if (data1 !== null) {
        const msgstring = JSON.stringify(data1);
        if (msgstring !== '') { console.log(msgstring); }
      }
      if (data2 !== null) {
        const msgstring = JSON.stringify(data2);
        if (msgstring !== '') { console.log(msgstring); }
      }
      if (data3 !== null) {
        const msgstring = JSON.stringify(data3);
        if (msgstring !== '') { console.log(msgstring); }
      }
      console.log(' ========= dateString - End =========== ');
    }
    else {
      console.log(' Log Msg Empty.... or Logging False');
    }
  }
}

