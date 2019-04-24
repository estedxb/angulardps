import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser, DpsPostion } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PositionsService {
  private getPositionsByVatNumberUrl = '';
  private getPositionUrl = '';

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'my-auth-token' }) };

  constructor(private http: HttpClient) {
    if (environment.dataFromAPI_JSON && environment.getPositionsByVatNumber !== '') {
      console.log('Data From Remote');
      this.getPositionsByVatNumberUrl = environment.dpsAPI + environment.getPositionsByVatNumber;
      this.getPositionUrl = environment.dpsAPI + environment.getPosition;
    } else {
      console.log('Data From JSON');
      this.getPositionsByVatNumberUrl = '../../assets/data/positions.json';
    }
  }

  public getPositionsByVatNumber(parameter: string): Observable<DpsPostion[]> {
    console.log('PositionsService Data From = ' + this.getPositionsByVatNumberUrl + '/' + parameter);
    const result = this.http.get<DpsPostion[]>(
      this.getPositionsByVatNumberUrl + '/' + parameter, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public createPosition(position: any): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.getPositionUrl, position, {
      headers: httpHeaders,
      observe: 'response'
    });
  }
  public updatePosition(position: any): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getPositionUrl, position, {
      headers: httpHeaders,
      observe: 'response'
    });
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


