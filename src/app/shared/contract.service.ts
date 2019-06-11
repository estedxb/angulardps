import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contract, DpsContract, PrintContractPDF, ApproveContractSuccess, ApproveContract, ContractReason } from './models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private getContractByVatNumberUrl = '';
  private getContractURL = '';
  private getPrintContractFileURL = '';
  private getApproveContractURL = '';
  private getContractReasonURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getContract !== '') {
      // console.log('Data From Remote');      
      this.getContractURL = environment.dpsAPI + environment.getContract;
    } else {
      // console.log('Data From JSON');
      this.getContractByVatNumberUrl = '';
    }

    if (environment.dataFromAPI_JSON && environment.getPrintContractFileURL !== '') {
      console.log('getPrintContractFileURL Data From Remote');
      this.getPrintContractFileURL = environment.dpsAPI + environment.getPrintContractFileURL;
    } else {
      console.log('getPrintContractFileURL Data From JSON');
      this.getPrintContractFileURL = environment.getAssetsDataPath + 'printContract.json';
    }

    if (environment.dataFromAPI_JSON && environment.getApproveContractURL !== '') {
      console.log('getApproveContractURL Data From Remote');
      this.getApproveContractURL = environment.dpsAPI + environment.getApproveContractURL;
    } else {
      console.log('getApproveContractURL Data From JSON');
      this.getApproveContractURL = environment.getAssetsDataPath + 'approveContract.json';
    }

    if (environment.dataFromAPI_JSON && environment.getContractReasonURL !== '') {
      console.log('getContractReasonURL Data From Remote');
      this.getContractReasonURL = environment.dpsAPI + environment.getContractReasonURL;
    } else {
      console.log('getContractReasonURL Data From JSON');
      this.getContractReasonURL = environment.getAssetsDataPath + 'contractreason.json';
    }

  }

  public createContract(contract: DpsContract): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    // console.log('createContract Data From = ' + this.getContractURL);
    return this.http.post<any>(this.getContractURL, contract, { headers: httpHeaders, observe: 'response' });
  }

  public updateContract(contract: DpsContract): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    // console.log('updateContract Data From = ' + this.getContractURL);
    return this.http.put<any>(this.getContractURL, contract, { headers: httpHeaders, observe: 'response' });
  }

  public getPrintContractPDFFileURL(vatNumber: string, contractId: number): Observable<string> {
    // console.log('getContractById');
    let result: any = null;
    if (environment.dataFromAPI_JSON && environment.getPrintContractFileURL !== '') {
      console.log('getPrintContractPDFFileURL API Data From = ' + this.getPrintContractFileURL + '/' + vatNumber + '/' + contractId);
      result = this.http.get<any>(this.getPrintContractFileURL + '/' + vatNumber + '/' + contractId).catch(this.errorHandler);
    } else {
      console.log('getPrintContractPDFFileURL JSON Data From = ' + this.getPrintContractFileURL);
      result = this.http.get<any>(this.getPrintContractFileURL).catch(this.errorHandler);
    }
    console.log('getPrintContractPDFFileURL result', result);
    return result;
  }

  public getApproveContract(vatNumber: string, contractId: number): Observable<ApproveContractSuccess> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    let result: any = null;
    const approveContract = new ApproveContract();
    approveContract.customerVatNumber = vatNumber;
    approveContract.contractId = contractId.toString();
    console.log('getApproveContract Data From = ' + this.getApproveContractURL);

    if (environment.dataFromAPI_JSON && environment.getApproveContractURL !== '') {
      this.getApproveContractURL = this.getApproveContractURL + '/' + vatNumber + '/' + contractId;
      result = this.http.get<any>(this.getApproveContractURL).catch(this.errorHandler);
    } else {
      result = this.http.get<any>(this.getApproveContractURL).catch(this.errorHandler);
    }
    console.log(result);
    return result;
  }

  public getContractByVatNoAndId(vatNumber: string, contractId: string): Observable<DpsContract> {
    // console.log('getContractById');
    // console.log('getContractByVatNoAndId Data From = ' + this.getContractURL + '/' + vatNumber +'/' + contractId);
    const result = this.http.get<any>(this.getContractURL + '/' + vatNumber + '/' + contractId).catch(this.errorHandler);
    // console.log(result);
    return result;
  }

  public getContractReason(): Observable<ContractReason[]> {
    console.log('getContractReason');
    console.log('getContractReason Data From = ' + this.getContractReasonURL);
    const result = this.http.get<any>(this.getContractReasonURL).catch(this.errorHandler);
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
