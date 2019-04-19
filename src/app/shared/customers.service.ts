import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Customer, DPSCustomer } from './models';
import { Observable } from 'rxjs/observable';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CustomersService {

  private getCountriesListUrl = '';
  private getCustomersByVatNumberUrl = "";
  private createCustomerURL = "";

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getCustomers !== '') {
      console.log('Data From Remote');
      this.getCountriesListUrl = environment.dpsAPI + environment.getCustomers;
      this.getCustomersByVatNumberUrl = environment.dpsAPI + environment.getCustomerByVatNumber;
      this.createCustomerURL = environment.dpsAPI + environment.createCustomer;
    } else {
      console.log('Data From JSON');
      this.getCountriesListUrl = 'assets/data/customers.json';
    }
  }

  public getCustomers(): Observable<DPSCustomer[]> {
    console.log('CustomersService Data From = ' + this.getCountriesListUrl);
    const result =  this.http.get<DPSCustomer[]>(this.getCountriesListUrl).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getCustomersByVatNumber(parameter:string): Observable<DPSCustomer> {
      console.log("hello");

      const result = this.http.get<any>(this.getCustomersByVatNumberUrl + '?VatNumber='+parameter).catch(this.errorHandler);
      console.log(result);
      return result;
  }

  public createCustomer(customer:any): Observable<any>
  {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

   return this.http.post<any>(this.createCustomerURL,customer, {
      headers: httpHeaders,
      observe: 'response'
   });
  }

  errorHandler(error: HttpErrorResponse) { 
    console.log(error.status);

    if(error.status === 400)
      console.log("vat number not correct format");
    if(error.status === 204)
      console.log("vat number doesnt exist ");
    if(error.status === 409)
      console.log('customer exists in the system, dont allow customer to create');

    return Observable.throwError(error.message); 
  }

}

/*

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { throwError, concat, of } from 'rxjs';

*/
