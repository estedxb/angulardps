import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private getUsersByVatNumberUrl = '';
  private getUserUrl = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getUsersByVatNumber !== '') {
      // this.logger.log('Data From Remote');
      this.getUsersByVatNumberUrl = environment.dpsAPI + environment.getUsersByVatNumber;
      this.getUserUrl = environment.dpsAPI + environment.getUser;
    } else {
      this.logger.log('Data From JSON');
      this.getUsersByVatNumberUrl = environment.getAssetsDataPath + 'users.json';
    }
  }

  public getUsersByVatNumber(vatnumber: string): Observable<DpsUser[]> {
    // this.logger.log('UserService Data From = ' + this.getUsersByVatNumberUrl + '/' + parameter);
    const result = this.http.get<DpsUser[]>(this.getUsersByVatNumberUrl + '/' + vatnumber).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

/*
  public getUsersByEmail(vatnumber: string, useremail: string): Observable<DpsUser> {
    // this.logger.log('UserService Data From = ' + this.getUsersByVatNumberUrl + '/' + parameter);
    const result = this.http.get<DpsUser>(this.getUsersByVatNumberUrl + '/' + vatnumber + '/' + useremail).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }
*/

  public createUser(dpsuser: DpsUser): Observable<any> {
    // this.logger.log('Create User Url', this.getUserUrl);
    // this.logger.log('createUser', dpsuser);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<DpsUser>(this.getUserUrl, dpsuser, { headers: httpHeaders, observe: 'response' });
  }

  public updateUser(dpsuser: DpsUser): Observable<any> {
    // this.logger.log('Update User Url', this.getUserUrl);
    // this.logger.log('updateUser', dpsuser);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getUserUrl, dpsuser, { headers: httpHeaders, observe: 'response' });
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.logger.log('vat number not correct format');
    } else if (error.status === 204) {
      this.logger.log('vat number doesnt exist ');
    } else if (error.status === 409) {
      this.logger.log('user exists in the system, dont allow customer to create');
    } else {
      this.logger.log('Error :: ' + error.status + ' || error.message :: ' + error.message);
    }
    return Observable.throwError(error.message);
  }
}
