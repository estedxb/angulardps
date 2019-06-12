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
    const dateString: string = date.getFullYear() + '-' + this.Trim('0' + date.getMonth() + 1, 2)
      + '-' + this.Trim('0' + date.getDate(), 2) + ' ' + date.getHours() + ':' + date.getMinutes();
    if ((msg !== null || data1 !== null || data2 !== null || data3 !== null) && this.isLoggingRequired) {
      this.ConsoleLog(' ========= ' + dateString + ' =========== ');
      this.ConsoleLog(msg);
      this.ConsoleLog(data1);
      this.ConsoleLog(data2);
      this.ConsoleLog(data3);
    } else {
      if (this.isLoggingRequired) { this.ConsoleLog(' Log Msg Empty....'); }
    }
  }

  Trim(data: string, len: number) { return data.substring(data.length - (len + 1), len); }

  ConsoleLog(data: any) {
    try {
      if (data !== null) {
        console.log(data);
        // const msgstring = JSON.stringify(data);
        // if (msgstring !== '') { console.log(msgstring); }
      }
    } catch (e) {
      console.log(data);
    }
  }
}

