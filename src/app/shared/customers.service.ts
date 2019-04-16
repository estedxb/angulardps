import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Customer } from '../models/customer';
import { Observable } from 'rxjs/observable';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CustomersService {

  private getCountriesListUrl = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getCustomers !== '') {
      console.log('Data From Remote');
      this.getCountriesListUrl = environment.dpsAPI + environment.getCustomers;
    } else {
      console.log('Data From JSON');
      this.getCountriesListUrl = 'assets/data/customers.json';
    }
  }

  public getCustomers(): Observable<Customer[]> {
    console.log('Data From = ' + this.getCountriesListUrl);
    return this.http.get<Customer[]>(this.getCountriesListUrl).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}

/*

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { throwError, concat, of } from 'rxjs';

*/
