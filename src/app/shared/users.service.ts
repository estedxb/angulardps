import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private getUsersByVatNumberUrl = '';
  private getUserUrl = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getUsersByVatNumber !== '') {
      console.log('Data From Remote');
      this.getUsersByVatNumberUrl = environment.dpsAPI + environment.getUsersByVatNumber;
      this.getUserUrl = environment.dpsAPI + environment.getUser;
    } else {
      console.log('Data From JSON');
      this.getUsersByVatNumberUrl = '../../assets/data/users.json';
    }
  }

  public getUsersByVatNumber(parameter: string): Observable<DpsUser[]> {
    console.log('UserService Data From = ' + this.getUsersByVatNumberUrl + '/' + parameter);
    const result = this.http.get<DpsUser[]>(
      this.getUsersByVatNumberUrl + '/' + parameter).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public createUser(dpsuser: DpsUser): Observable<any> {
    console.log('Create User Url', this.getUserUrl);
    console.log('createUser', dpsuser);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<DpsUser>(this.getUserUrl, dpsuser, { headers: httpHeaders, observe: 'response' });
  }

  public updateUser(dpsuser: DpsUser): Observable<any> {
    console.log('Update User Url', this.getUserUrl);
    console.log('updateUser', dpsuser);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getUserUrl, dpsuser, { headers: httpHeaders, observe: 'response' });
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
