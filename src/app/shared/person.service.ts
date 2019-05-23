import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser, DpsPostion, DpsPerson, DpsSchedule, DpsScheduleCall } from './models';
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
  private getDpsScheduleURL = '';
  private getPersonbyIdURL = '';
  private getPersonURL = '';
  private postPersonURL = '';
  private putPersonURL = '';
  private getVehiclesURL = '';
  private deletePersonURL = '';
  private postPersonDocumentsURL = '';

  constructor(private http: HttpClient) {

    // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getPerson !== '') {
      // console.log('Data From getPerson Remote');
      this.getPersonURL = environment.dpsAPI + environment.getPerson;
      this.postPersonDocumentsURL = environment.dpsAPI + environment.postPersonDocuments;
    } else {
      console.log('Data From getPerson JSON');
      this.getPersonURL = '../../assets/data/locations.json';
    }

    if (environment.dataFromAPI_JSON && environment.getVehicles !== '') {
      // console.log('Data From getVehicles Remote');
      this.getVehiclesURL = environment.dpsAPI + environment.getVehicles;
    } else {
      console.log('Data From getVehicles JSON');
      this.getVehiclesURL = '../../assets/data/vehicles.json';
    }

    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
      // console.log('Data From getPersonsByVatNumber Remote');
      this.getPersonForCustomerbyCustomerVatNumberURL = environment.dpsAPI + environment.getPersonsByVatNumber;
    } else {
      console.log('Data From getPersonsByVatNumber JSON');
      this.getPersonForCustomerbyCustomerVatNumberURL = '../../assets/data/persons.json';
    }

    if (environment.dataFromAPI_JSON && environment.getDpsSchedules !== '') {
      // console.log('Data From getDpsSchedule Remote');
      this.getDpsScheduleURL = environment.dpsAPI + environment.getDpsSchedules;
    } else {
      console.log('Data From getDpsSchedule JSON');
      this.getDpsScheduleURL = '../../assets/data/dpsSchedules.json';
    }

    this.getPersonForCustomerbySSIdNCVNURL = environment.dpsAPI + environment.getPersonBySSIDNVatNumber;
    this.getPersonbyIdURL = environment.dpsAPI + environment.getPersonById;
    this.postPersonURL = environment.dpsAPI + environment.CreatePerson;
    this.putPersonURL = environment.dpsAPI + environment.CreatePerson;
    this.requestCertificateURL = "";

  }

  public getVehiclesForLicense(): Observable<any> {
    // console.log('PersonService getVehiclesForLicense Data From = ' + this.getVehiclesURL);
    const result = this.http.get<DpsPerson[]>(this.getVehiclesURL, this.httpOptions).catch(this.errorHandler);
    // console.log(result);
    return result;
  }
  public getPersonsByVatNumber(customervatnumber: string): Observable<any> {
    let getURL = this.getPersonForCustomerbyCustomerVatNumberURL;
    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
      getURL = getURL + '/' + customervatnumber;
    }
    // console.log('PersonService getPersonsByVatNumber Data From = ' + getURL);
    const result = this.http.get<DpsPerson[]>(getURL, this.httpOptions).catch(this.errorHandler);
    // console.log(result);
    return result;
  }

  public getDpsScheduleByVatNumber(customerVatNumber: string, startDate: Date, endDate: Date): Observable<any> {
    let getURL = this.getDpsScheduleURL;
    let result = null;
    // console.log('PersonService getDpsScheduleByVatNumber ');
    if (environment.dataFromAPI_JSON && environment.getDpsSchedules !== '') {
      getURL = getURL + '/{"customerVatNumber" : "' + customerVatNumber + '", "startDate" : "' + startDate + '", "endDate" : "' + endDate + '"}';
      // console.log('PersonService API getDpsScheduleByVatNumber Data From = ' + getURL);
      let dpsScheduleCall = new DpsScheduleCall();
      dpsScheduleCall.customerVatNumber = customerVatNumber;
      dpsScheduleCall.startDate = startDate.toString();
      dpsScheduleCall.endDate = endDate.toString();
      result = this.http.post<any>(getURL, dpsScheduleCall , this.httpOptions).catch(this.errorHandler);
    } else {
      if (customerVatNumber !== '123456789101') {
        getURL = getURL.replace('.json', '_empty.json');
      }
      // console.log('PersonService JSON getDpsScheduleByVatNumber Data From = ' + getURL);
      result = this.http.get<any>(getURL, this.httpOptions).catch(this.errorHandler);    
    }
    // console.log(result);
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

  updateMedicalAttestationFile(fileToUpload: File, CustomerVatNumber: string, ssid: string, fileType: string, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    // console.log('formData:::', formData);
    return this.http.post<any>(this.postPersonDocumentsURL + '/' + CustomerVatNumber + '/' + ssid + '/' + fileType + '/' + fileName, formData,
      { observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }
  handleError(e: any): import('rxjs').ObservableInput<boolean> {
    throw new Error('Method not implemented.');
  }


  vcaAttestationFile(fileToUpload: File, CustomerVatNumber: string, ssid: string, fileType: string, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(this.postPersonDocumentsURL + '/' + CustomerVatNumber + '/' + ssid + '/' + fileType + '/' + fileName, formData,
      { observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }

  constructionCardsFile(fileToUpload: File, CustomerVatNumber: string, ssid: string, fileType: string, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(this.postPersonDocumentsURL + '/' + CustomerVatNumber + '/' + ssid + '/' + fileType + '/' + fileName, formData,
      { observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }


  studentAtWorkFile(fileToUpload: File, CustomerVatNumber: string, ssid: string, fileType: string, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(this.postPersonDocumentsURL + '/' + CustomerVatNumber + '/' + ssid + '/' + fileType + '/' + fileName, formData,
      { observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }

  otherDocumentsFile(fileToUpload: File, CustomerVatNumber: string, ssid: string, fileType: string, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(this.postPersonDocumentsURL + '/' + CustomerVatNumber + '/' + ssid + '/' + fileType + '/' + fileName, formData,
      { observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }

  driversFile(fileToUpload: File, CustomerVatNumber: string, ssid: string, fileType: string, fileName: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(this.postPersonDocumentsURL + '/' + CustomerVatNumber + '/' + ssid + '/' + fileType + '/' + fileName, formData,
      { observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }



  public updatePosition(person: any): Observable<any> {
    // console.log("in update position call:");
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
