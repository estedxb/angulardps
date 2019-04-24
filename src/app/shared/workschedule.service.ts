import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CountriesList } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkscheduleService {
  private getCountriesListUrl = '';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
    if (environment.dataFromAPI_JSON && environment.getCounteries !== '') {
      this.getCountriesListUrl = environment.dpsAPI + environment.getCounteries;
    } else {
      this.getCountriesListUrl = '../../assets/data/countries.json';
    }
  }

  public getCountriesList(): Observable<CountriesList[]> {
    console.log('CountriesService Data From = ' + this.getCountriesListUrl);
    const result = this.http.get<CountriesList[]>(this.getCountriesListUrl, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}
