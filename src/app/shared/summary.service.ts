import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Summaries } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', Authorization: 'my-auth-token', observe: 'response'
    })
  };

  private getSummaryURL = '';
  private getSummary = '';

  constructor(private http: HttpClient) {

    // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getSummaryURL !== '') {
      console.log('Data From Remote');
      this.getSummaryURL = environment.dpsAPI + environment.getSummaryURL;
    } else {
      console.log('Data From JSON');
      this.getSummaryURL = '../../assets/data/summary.json';
    }

    this.getSummary = environment.dpsAPI + environment.getSummary;

  }

  public getSummaryByVatnumber(customervatnumber: string): Observable<any> {
    let getURL = this.getSummaryURL;
    if (environment.dataFromAPI_JSON && environment.getSummaryURL !== '') { getURL = getURL + '/' + customervatnumber; }
    console.log('SummaryService Data From = ' + getURL);
    const result = this.http.get<Summaries[]>(getURL, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public updateSummaryByVatnumberAndSummaryID(summaries: Summaries): Observable<any> {
    const getURL = this.getSummary;
    console.log('SummaryService Update Summaries ');
    console.log('getURL :: ', getURL, summaries);
    const result = this.http.put<Summaries[]>(getURL, summaries, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.status === 400) {
      console.log('vat number not correct format');
    } else if (error.status === 204) {
      console.log('vat number doesnt exist ');
    } else if (error.status === 409) {
      console.log('user exists in the system, dont allow customer to create');
    } else {
      console.log('Error :: ' + error.status + ' || error.message :: ' + error.message);
    }
    return Observable.throwError(error.message);
  }

}
