import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser, DpsPostion, DpsPerson, DpsSchedule, DpsScheduleCall } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})

export class PersonService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'my-auth-token' }) };

  private getPersonForCustomerbyCustomerVatNumberURL = '';
  private getPersonForCustomerbySSIdNCVNURL = '';
  private getPersonBySSIDBoemmURL = '';
  private requestCertificateURL = '';
  private getDpsScheduleURL = '';
  private getPersonbyIdURL = '';
  private getPersonURL = '';
  private postPersonURL = '';
  private putPersonURL = '';
  private getVehiclesURL = '';
  private deletePersonURL = '';
  private postPersonDocumentsURL = '';

  constructor(private http: HttpClient, private logger: LoggingService) {

    if(environment.dataFromAPI_JSON && environment.getPersonBySSIDBoemm !== '') {
        this.getPersonBySSIDBoemmURL = environment.boemmAPI + environment.getPersonBySSIDBoemm;
    }
    else {
      this.getPersonBySSIDBoemmURL = environment.getAssetsDataPath + 'persons.json';
    }

    // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getPerson !== '') {
      // this.logger.log('Data From getPerson Remote');
      this.getPersonURL = environment.dpsAPI + environment.getPerson;
      this.postPersonDocumentsURL = environment.dpsAPI + environment.postPersonDocuments;
    } else {
      this.logger.log('Data From getPerson JSON');
      this.getPersonURL = environment.getAssetsDataPath + 'locations.json';
    }

    if (environment.dataFromAPI_JSON && environment.getVehicles !== '') {
      // this.logger.log('Data From getVehicles Remote');
      this.getVehiclesURL = environment.dpsAPI + environment.getVehicles;
    } else {
      this.logger.log('Data From getVehicles JSON');
      this.getVehiclesURL = environment.getAssetsDataPath + 'vehicles.json';
    }

    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
      // this.logger.log('Data From getPersonsByVatNumber Remote');
      this.getPersonForCustomerbyCustomerVatNumberURL = environment.dpsAPI + environment.getPersonsByVatNumber;
    } else {
      this.logger.log('Data From getPersonsByVatNumber JSON');
      this.getPersonForCustomerbyCustomerVatNumberURL = environment.getAssetsDataPath + 'persons.json';
    }

    if (environment.dataFromAPI_JSON && environment.getDpsSchedules !== '') {
      // this.logger.log('Data From getDpsSchedule Remote');
      this.getDpsScheduleURL = environment.dpsAPI + environment.getDpsSchedules;
    } else {
      this.logger.log('Data From getDpsSchedule JSON');
      this.getDpsScheduleURL = environment.getAssetsDataPath + 'dpsSchedules.json';
    }

    this.getPersonForCustomerbySSIdNCVNURL = environment.dpsAPI + environment.getPersonBySSIDNVatNumber;
    this.getPersonbyIdURL = environment.dpsAPI + environment.getPersonById;
    this.postPersonURL = environment.dpsAPI + environment.CreatePerson;
    this.putPersonURL = environment.dpsAPI + environment.CreatePerson;
    this.requestCertificateURL = "";

  }

  public getVehiclesForLicense(): Observable<any> {
    // this.logger.log('PersonService getVehiclesForLicense Data From = ' + this.getVehiclesURL);
    const result = this.http.get<DpsPerson[]>(this.getVehiclesURL, this.httpOptions).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }
  public getPersonsByVatNumber(customervatnumber: string): Observable<any> {
    let getURL = this.getPersonForCustomerbyCustomerVatNumberURL;
    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
      getURL = getURL + '/' + customervatnumber;
    }
    // this.logger.log('PersonService getPersonsByVatNumber Data From = ' + getURL);
    const result = this.http.get<DpsPerson[]>(getURL, this.httpOptions).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

  public getDpsScheduleByVatNumber(customerVatNumber: string, startDate: string, endDate: string): Observable<DpsSchedule> {
    let getURL = this.getDpsScheduleURL;
    let result = null;
    // this.logger.log('PersonService getDpsScheduleByVatNumber ');
    if (environment.dataFromAPI_JSON && environment.getDpsSchedules !== '') {
      getURL = getURL + '/';
      this.logger.log('PersonService API getDpsScheduleByVatNumber Data From = ' + getURL);
      let dpsScheduleCall = new DpsScheduleCall();
      dpsScheduleCall.customerVatNumber = customerVatNumber;
      dpsScheduleCall.startDate = startDate;
      dpsScheduleCall.endDate = endDate;
      result = this.http.post<any>(getURL, dpsScheduleCall, this.httpOptions).catch(this.errorHandler);
    } else {
      if (customerVatNumber !== '123456789101') {
        getURL = getURL.replace('.json', '_empty.json');
      }
      this.logger.log('PersonService JSON getDpsScheduleByVatNumber Data From = ' + getURL);
      result = this.http.get<any>(getURL, this.httpOptions).catch(this.errorHandler);
    }
    // this.logger.log(result);
    return result;
  }

  public getPersonBySSIDBoemm(ssid: string):Observable<DpsPerson> {

    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const result = this.http.get<DpsPerson>(
      this.getPersonBySSIDBoemmURL + '/' + ssid, this.httpOptions).catch(this.errorHandler);
    return result;

  }

  public getPersonBySSIDVatnumber(ssid: string, customervatnumber: string): Observable<DpsPerson> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const result = this.http.get<DpsPerson>(
      this.getPersonForCustomerbySSIdNCVNURL + '/' + ssid + '/' + customervatnumber, this.httpOptions).catch(this.errorHandler);
    return result;
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
    // this.logger.log('formData:::', formData);
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
    // this.logger.log("in update position call:");
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.putPersonURL, person, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.logger.log('vat number not correct format');
    } else if (error.status === 204) {
      this.logger.log('vat number doesnt exist ');
    } else if (error.status === 409) {
      this.logger.log('user exists in the system, dont allow customer to create');
    } else {
      this.logger.log('Error :: ' + error.status + ' || error.message :: ' + error.message);
    }
    return Observable.throwError(error.message);
  }





}
