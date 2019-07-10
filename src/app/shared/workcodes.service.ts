import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { WorkCodes } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class WorkCodesService {
  private getWorkCodeUrl = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getCodes !== '') {
      this.getWorkCodeUrl = environment.boemmAPI + environment.getCodes;
    } else {
      this.getWorkCodeUrl = environment.getAssetsDataPath + 'jointcommittee.json';
    }
    // console.log('Data From = ' + this.getWorkCodeUrl);
  }

  public getWorkCodes(): Observable<WorkCodes[]> {
    // console.log('LegalformService Data From = ' + this.getWorkCodeUrl);
    const result = this.http.get<WorkCodes[]>(this.getWorkCodeUrl).catch(this.errorHandler);
    // console.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}
