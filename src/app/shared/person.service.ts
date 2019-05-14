import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser, DpsPostion, DpsPerson } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PersonService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'my-auth-token' }) };

  private getPersonForCustomerbyCustomerVatNumberURL = '';
  private getPersonForCustomerbySSIdNCVNURL = '';
  private getPersonbyIdURL = '';
  private getPersonURL = ''
  private postPersonURL = '';
  private putPersonURL = '';
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

    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
      console.log('Data From getPersonsByVatNumber Remote');
      this.getPersonForCustomerbyCustomerVatNumberURL = environment.dpsAPI + environment.getPersonsByVatNumber;
    } else {
      console.log('Data From getPersonsByVatNumber JSON');
      this.getPersonForCustomerbyCustomerVatNumberURL = '../../assets/data/persons.json';
    }

    this.getPersonForCustomerbySSIdNCVNURL = environment.dpsAPI + environment.getPersonBySSIDNVatNumber;
    this.getPersonbyIdURL = environment.dpsAPI + environment.getPersonById;
    this.postPersonURL = environment.dpsAPI + environment.CreatePerson;
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
    let getURL = this.getPersonForCustomerbyCustomerVatNumberURL;
    if (environment.dataFromAPI_JSON && environment.getPersonsByVatNumber !== '') {
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
