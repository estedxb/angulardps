import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser, DpsPostion } from './models';
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
  private getPersonbyIdURL = '';
  private postPersonURL = '';
  private putPersonURL = '';
  private deletePersonURL = '';

  constructor(private http: HttpClient) {

    // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getPerson !== '') {
      console.log('Data From Remote');
      this.getPersonForCustomerbyCustomerVatNumberURL = environment.dpsAPI + environment.getPersonsByVatNumber;
      this.getPersonForCustomerbySSIdNCVNURL = environment.dpsAPI + environment.getPersonBySSIDNVatNumber;
      this.getPersonbyIdURL = environment.dpsAPI + environment.getPersonById;
      this.postPersonURL = environment.dpsAPI + environment.CreatePerson;
    } else {
      console.log('Data From JSON');
      // this.getLocationByVatNumberUrl = '../../assets/data/locations.json';
    }
  }

  public getPersonsByVatNumber(customervatnumber: string): Observable<any> {
    console.log('PositionsService Data From = ' + this.getPersonForCustomerbyCustomerVatNumberURL + '/' + customervatnumber);
    const result = this.http.get<DpsPostion[]>(
      this.getPersonForCustomerbyCustomerVatNumberURL + '/' + customervatnumber, this.httpOptions).catch(this.errorHandler);
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
  
  

  public updatePosition(id: any): Observable<any> {
    // const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    // return this.http.put<any>(this.getPersonbyIdURL, position, {
    //   headers: httpHeaders,
    //   observe: 'response'
    // });

    return null;
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
