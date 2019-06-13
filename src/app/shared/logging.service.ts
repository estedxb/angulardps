import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { getMinutes } from 'ngx-bootstrap/chronos/utils/date-getters';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  public apiServer: any;
  public isRequireAuth = true;
  public isLoggingRequired = environment.isLoggingRequired;
  public dateString = '';
  public monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor() {
    const date = new Date();
    this.dateString = this.Trim(date.getDate(), 2) + ' ' + this.monthNames[date.getMonth() + 1] + ' ' + date.getFullYear()
      + ' ' + this.Trim(date.getHours(), 2) + ':' + this.Trim(date.getMinutes(), 2);
  }

  Trim(data: number, len: number) {
    let prefix = '';
    let dataString = data.toString();
    for (let i = 0; i < len; i++) {
      prefix += '0';
    }
    dataString = prefix + dataString;
    return dataString.substr(dataString.length - len, len);
  }

  log(msg: any, data1: any = null, data2: any = null, data3: any = null) {
    if ((msg !== null || data1 !== null || data2 !== null || data3 !== null) && this.isLoggingRequired) {
      this.ConsoleLog(' ========= ' + this.dateString + ' =========== ');
      this.ConsoleLog(msg);
      this.ConsoleLog(data1);
      this.ConsoleLog(data2);
      this.ConsoleLog(data3);
    } else {
      if (this.isLoggingRequired) { this.ConsoleLog(' Log Msg Empty....'); } else { this.ConsoleLog(' Log Blocked ....'); }
    }
  }

  logF(msg: any, data1: any = null, data2: any = null, data3: any = null) {
    if ((msg !== null || data1 !== null || data2 !== null || data3 !== null)) {
      this.ConsoleLog(' ========= ' + this.dateString + ' =========== ');
      this.ConsoleLog(msg);
      this.ConsoleLog(data1);
      this.ConsoleLog(data2);
      this.ConsoleLog(data3);
    } else {
      this.ConsoleLog(' Log Msg Empty....');
    }
  }

  error(msg: any, data1: any = null, data2: any = null, data3: any = null) {
    if ((msg !== null || data1 !== null || data2 !== null || data3 !== null)) {
      this.ConsoleError(' ========= ' + this.dateString + ' =========== ');
      this.ConsoleError(msg);
      this.ConsoleError(data1);
      this.ConsoleError(data2);
      this.ConsoleError(data3);
    } else {
      this.ConsoleError(' Log Msg Empty....');
    }
  }


  ConsoleLog(data: any) {
    try {
      if (data !== null) {
        // this.WriteLog(data, 'log');
        console.log(data);
        // const msgstring = JSON.stringify(data);
        // if (msgstring !== '') { console.log(msgstring); }
      }
    } catch (e) {
      console.log(data);
    }
  }

  ConsoleError(data: any) {
    try {
      if (data !== null) {
        // this.WriteLog(data, 'error');
        console.error(data);
        // const msgstring = JSON.stringify(data);
        // if (msgstring !== '') { console.log(msgstring); }
      }
    } catch (e) {
      console.error(data);
    }
  }

  WriteLog(data, mode) {
    try { throw new Error(); } catch (e) {
      console.log(e.stack);
      const stackTraces = e.stack.split('at');
      const fileList = stackTraces[2].substr(
        stackTraces[2].lastIndexOf('/src'),
        stackTraces[2].length - 1).replace(')', ''
        );
      const functionName = stackTraces[2].substr(0, stackTraces[2].indexOf('(') - 1);

      // Do whatever you want, use console.log or angular2-logger service
      if (mode === 'error') {
        console.error(data);
      } else {
        console.log(data);
      }
    }
  }

}

