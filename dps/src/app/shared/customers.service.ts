import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  customers = [
    {id: 1, name: "Customers 001", description: "Customers 001 des", email: "c001@email.com"},
    {id: 2, name: "Customers 002", description: "Customers 002 des", email: "c002@email.com"},
    {id: 3, name: "Customers 003", description: "Customers 003 des", email: "c003@email.com"},
    {id: 4, name: "Customers 004", description: "Customers 004 des", email: "c004@email.com"}
  ];
  constructor() { }

  public getCustomers():Array<{id, name, description, email}>{
    return this.customers;
  }
  public createCustomer(customer: {id, name, description, email}){
    this.customers.push(customer);
  }
  /*
  public editCustomer(customer: {id, name, description, email}){
    this.customers.push(customer);
  }
  
  public deleteCustomer(customer: {id, name, description, email}){
    this.customers.push(customer);
  }
  */
}
