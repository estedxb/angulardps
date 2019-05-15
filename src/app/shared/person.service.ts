import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser, DpsPostion, DpsPerson } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PersonService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'my-auth-token' }) };

  private getPersonForCustomerbyCustomerVatNumberURL = '';
  private getPersonForCustomerbySSIdNCVNURL = '';
  private requestCertificateURL = '';
  private getPersonsContractsURL = '';
  private getPersonbyIdURL = '';
  private getPersonURL = ''
  private postPersonURL = '';
  private putPersonURL = '';
  private getVehiclesURL = '';
  private deletePersonURL = '';

  constructor(private http: HttpClient) {

    // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getPerson !== '') {
      console.log('Data From getPerson Remote');
      this.getPersonURL = environment.dpsAPI + environment.getPerson;
    } else {
      console.log('Data From getPerson JSON');
      this.getPersonURL = '../../assets/data/locations.json';
    }

    if (environment.dataFromAPI_JSON && environment.getVehicles !== '') {
      console.log('Data From getVehicles Remote');
      this.getVehiclesURL = environment.dpsAPI + environment.getVehicles;
    } else {
      console.log('Data From getVehicles JSON');
      this.getVehiclesURL = '../../assets/data/vehicles.json';
    }
    
    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
      console.log('Data From getPersonsByVatNumber Remote');
      this.getPersonForCustomerbyCustomerVatNumberURL = environment.dpsAPI + environment.getPersonsByVatNumber;
    } else {
      console.log('Data From getPersonsByVatNumber JSON');
      this.getPersonForCustomerbyCustomerVatNumberURL = '../../assets/data/persons.json';
    }

    if (environment.dataFromAPI_JSON && environment.getPersonsContracts !== '') {
      console.log('Data From getPersonsContracts Remote');
      this.getPersonsContractsURL = environment.dpsAPI + environment.getPersonsContracts;
    } else {
      console.log('Data From getPersonsContracts JSON');
      this.getPersonsContractsURL = '../../assets/data/personscontracts.json';
    }

    this.getPersonForCustomerbySSIdNCVNURL = environment.dpsAPI + environment.getPersonBySSIDNVatNumber;
    this.getPersonbyIdURL = environment.dpsAPI + environment.getPersonById;
    this.postPersonURL = environment.dpsAPI + environment.CreatePerson;
    this.putPersonURL = environment.dpsAPI + environment.CreatePerson;
    this.requestCertificateURL = "";

  }

  public getVehiclesForLicense(): Observable<any> {
    console.log('getVehiclesForLicense Data From = ' + this.getVehiclesURL);
    const result = this.http.get<DpsPerson[]>(this.getVehiclesURL, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }
  public getPersonsByVatNumber(customervatnumber: string): Observable<any> {
    let getURL = this.getPersonForCustomerbyCustomerVatNumberURL;
    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
      getURL = getURL + '/' + customervatnumber;
    }
    console.log('PositionsService Data From = ' + getURL);
    const result = this.http.get<DpsPerson[]>(getURL, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getPersonsContractsByVatNumber(customervatnumber: string, startdate: Date, enddate: Date): Observable<any> {
    let getURL = this.getPersonsContractsURL;
    if (environment.dataFromAPI_JSON && environment.getPersonsContracts !== '') {
      getURL = getURL + '/' + customervatnumber + '?startdate=' + startdate + '&enddate=' + enddate;
    }
    console.log('PositionsService Data From = ' + getURL);
    const result = this.http.get<DpsPerson[]>(getURL, this.httpOptions).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getPersonBySSIDVatnumber(ssid: string, customervatnumber: string): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(this.getPersonForCustomerbySSIdNCVNURL + '/' + ssid + '/' + customervatnumber, {
      headers: httpHeaders,
      observe: 'response'
    });
  }



  public createPerson(person: any): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.postPersonURL, person, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  public requestCertificate(details: any): Observable<any> {
    // customerVatNumber, socialSecurityId, action
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.requestCertificateURL, details, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  updateMedicalAttestationFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.put(this.postPersonURL, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }
  handleError(e: any): import('rxjs').ObservableInput<boolean> {
    throw new Error('Method not implemented.');
  }

  vcaAttestationFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.put(this.postPersonURL, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }

  constructionCardsFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.put(this.postPersonURL, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }


  studentAtWorkFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.put(this.postPersonURL, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }

  otherDocumentsFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.put(this.postPersonURL, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }

  driversFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.put(this.postPersonURL, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }



  public updatePosition(person: any): Observable<any> {
    console.log("in update position call:");
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.putPersonURL, person, {
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
      console.log('user exists in the system, dont allow customer to create');
    } else {
      console.log('Error :: ' + error.status + ' || error.message :: ' + error.message);
    }
    return Observable.throwError(error.message);
  }





}
