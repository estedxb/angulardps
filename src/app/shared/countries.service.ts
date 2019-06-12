import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CountriesList } from './models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private getCountriesListUrl = '';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient, private logger: LoggingService) {
    if (environment.boemmAPI && environment.getCounteries !== '') {
      this.getCountriesListUrl = environment.boemmAPI + environment.getCounteries;
    } else {
      this.getCountriesListUrl = environment.getAssetsDataPath + 'countries.json';
    }
  }

  public getCountriesList(): Observable<CountriesList[]> {
    // this.logger.log('CountriesService Data From = ' + this.getCountriesListUrl);
    const result = this.http.get<CountriesList[]>(this.getCountriesListUrl, this.httpOptions).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}
