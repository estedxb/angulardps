import { Injectable } from '@angular/core';
import { AppConfig } from './../app.config';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(public datepipe: DatePipe) { }

  /*
  log(msg: any) {
    console.log(new Date() + ': '
      + JSON.stringify(msg));
  }
  */

  log(msg: any, data: any = null) {
    let date = new Date();
    let resultmsg = this.datepipe.transform(date, 'yyyy-MM-dd HH:ss') + ': ' + JSON.stringify(msg);
    if (data !== null) {
      resultmsg += '/n' + JSON.stringify(data);
    }
    console.log(resultmsg);
  }
}
