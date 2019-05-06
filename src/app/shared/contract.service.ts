import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contract } from './models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private getContractByVatNumberUrl = '';
  private getContractURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getLocationsByVatNumber !== '') {
      console.log('Data From Remote');
      //this.getContractByVatNumberUrl = environment.dpsAPI + environment.getLocationsByVatNumber;
      this.getContractURL = environment.dpsAPI + environment.getLocation;
    } else {
      console.log('Data From JSON');
      this.getContractByVatNumberUrl = '../../assets/data/locations.json';
    }
  }

  public createContract(contract: Contract): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.getContractURL, contract, { headers: httpHeaders, observe: 'response' });
  }
}
