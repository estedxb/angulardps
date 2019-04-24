import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Postion } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PositionsService {
  private getPositionListUrl = '';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
    if (environment.dataFromAPI_JSON && environment.getCounteries !== '') {
      this.getPositionListUrl = environment.dpsAPI + environment.getPosition;
    } else {
      this.getPositionListUrl = 'assets/data/positions.json';
    }
  }

  public getCountriesList(): Observable<Position[]> {
    console.log('CountriesService Data From = ' + this.getPositionListUrl);
    const result = this.http.get<Position[]>(this.getPositionListUrl, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}


