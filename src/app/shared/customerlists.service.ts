import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CustomersList, LoginToken } from './models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';
import { getToken } from '@angular/router/src/utils/preactivation';

@Injectable({ providedIn: 'root' })
export class CustomerListsService {

  private getCustomerListUrl = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getCustomerLists !== '') {
      this.getCustomerListUrl = environment.dpsAPI + environment.getCustomerLists;
    } else {
      this.getCustomerListUrl = environment.getAssetsDataPath + 'customerlists.json';
    }
    // console.log('Data From = ' + this.getCustomerListUrl);
  }

  public getCustomers(): Observable<CustomersList[]> {
    // console.log('CustomerListsService Data From = ' + this.getCustomerListUrl);
    const result = this.http.get<CustomersList[]>(this.getCustomerListUrl).catch(this.errorHandler);
    // console.log(result);
    return result;
  }

  getToken() {
    const dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
    return dpsLoginToken.accessToken;
  }

  public getCustomersbyUserEmail(UserEmail: string, Token: string = ''): Observable<CustomersList[]> {
    console.log('CustomerListsService Data From = getCustomersbyUserEmail :: ' + this.getCustomerListUrl + '/' + UserEmail);
    if (Token === '') { Token = this.getToken(); }

    const result = this.http.get<CustomersList[]>(this.getCustomerListUrl + '/' + UserEmail, {
      headers: { Authorization: 'Token token="' + Token + '"' }
    }).catch(this.errorHandler);
    // console.log(result);
    return result;
  }
  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }


}
