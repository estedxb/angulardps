import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contract, DpsContract } from './models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private getContractByVatNumberUrl = '';
  private getContractURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getContract !== '') {
      console.log('Data From Remote');      
      this.getContractURL = environment.dpsAPI + environment.getContract;
    } else {
      console.log('Data From JSON');
      this.getContractByVatNumberUrl = '';
    }
  }

  public createContract(contract: DpsContract): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.getContractURL, contract, { headers: httpHeaders, observe: 'response' });
  }

  public updateContract(contract: DpsContract): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getContractURL, contract, { headers: httpHeaders, observe: 'response' });
  }


  public getContractByVatNoAndId(vatNumber: string,contractId: string): Observable<DpsContract> {
    console.log('getContractById');
    const result = this.http.get<any>(this.getContractURL + '/' + vatNumber +'/' + contractId).catch(this.errorHandler);
    console.log(result);
    return result;
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
