import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { ICustomer } from '../models/customer';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CustomersService {

  private getCustomerUrl = 'assets/data/customers.json';
  //private getCustomerUrl = environment.apiURL + environment.getcustomers;

  constructor(private http: HttpClient) { }

  public getCustomers(): Observable<ICustomer[]> {
      return this.http.get<ICustomer[]>(this.getCustomerUrl)
        .catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse){
      return Observable.throw(error.message);
  }

}
  /*
  public createCustomer(customer: {id, name, description, email}){
    this.customers.push(customer);
  }

  public editCustomer(customer: {id, name, description, email}){
    this.customers.push(customer);
  }

  public deleteCustomer(customer: {id, name, description, email}){
    this.customers.push(customer);
  }
  */