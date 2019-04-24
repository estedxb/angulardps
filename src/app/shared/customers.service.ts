import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Customer, DPSCustomer } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomersService {

  private getCustomersListUrl = '';
  private getCustomersByVatNumberUrl = '';
  private createCustomerURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getCustomersByVatNumber !== '') {
      console.log('Data From Remote getCustomers');
      this.getCustomersListUrl = environment.dpsAPI + environment.getCustomers;
      this.getCustomersByVatNumberUrl = environment.dpsAPI + environment.getCustomersByVatNumber;
      this.createCustomerURL = environment.dpsAPI + environment.getCustomers;
    } else {
      console.log('Data From JSON getCustomers');
      this.getCustomersListUrl = '../../assets/data/customers.json';
    }
  }

  public getCustomers(): Observable<DPSCustomer[]> {
    console.log('CustomersService Data From = ' + this.getCustomersListUrl);
    const result = this.http.get<any>(this.getCustomersListUrl).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getCustomersByVatNumber(parameter: string): Observable<DPSCustomer> {
    console.log('hello');

    const result = this.http.get<any>(this.getCustomersByVatNumberUrl + '?VatNumber=' + parameter).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public createCustomerUpdate(customer: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(this.createCustomerURL, customer, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  public createCustomer(customer: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.createCustomerURL, customer, {
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
      console.log('customer exists in the system, dont allow customer to create');
    } else {
      console.log('Error :: ' + error.status + ' || error.message :: ' + error.message);
    }

    return Observable.throwError(error);
  }

}
