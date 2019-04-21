import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Statute } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class StatuteService {
  private getStatuteUrl = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getStatute !== '') {
      this.getStatuteUrl = environment.boemmAPI + environment.getStatute;
    } else {
      this.getStatuteUrl = 'assets/data/statute.json';
    }
    console.log('Data From = ' + this.getStatuteUrl);
  }

  public getStatutes(): Observable<Statute[]> {
    console.log('LegalformService Data From = ' + this.getStatuteUrl);
    const result = this.http.get<Statute[]>(this.getStatuteUrl).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}
