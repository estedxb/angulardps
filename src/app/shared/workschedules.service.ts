import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { WorkSchedule, DpsWorkSchedule } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkschedulesService {

  private isRemoteURL = false;
  private getWorkscheduleByVatNumberUrl = '';
  private getWorkscheduleEmptyUrl = '';
  private getWorkscheduleURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    //environment.getWorkSchedulesByVatNumber = '';
    if (environment.dataFromAPI_JSON && environment.getWorkSchedulesByVatNumber !== '') {
      console.log('Data Work Schedules From Remote');
      this.isRemoteURL = true;
      this.getWorkscheduleByVatNumberUrl = environment.dpsAPI + environment.getWorkSchedulesByVatNumber;
      this.getWorkscheduleURL = environment.dpsAPI + environment.getWorkSchedule;
      this.getWorkscheduleEmptyUrl = environment.getWorkscheduleEmpty;
    } else {
      console.log('Data Work Schedules From JSON');
      this.isRemoteURL = false;
      this.getWorkscheduleByVatNumberUrl = '../../assets/data/workschedules.json';
      this.getWorkscheduleEmptyUrl = '../../assets/data/workschedules_empty.json';
    }
  }

  public getWorkscheduleByVatNumber(parameter: string): Observable<any[]> {
    let WorkscheduleByVatNumberUrl = this.getWorkscheduleByVatNumberUrl;
    if (this.isRemoteURL) { WorkscheduleByVatNumberUrl = this.getWorkscheduleByVatNumberUrl + '/' + parameter; }
    console.log('Get Work Schedule By Vat Number Url', WorkscheduleByVatNumberUrl);
    const result = this.http.get<any[]>(WorkscheduleByVatNumberUrl).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getWorkscheduleEmpty(parameter: string = ''): Observable<any[]> {
    console.log('Get Work Schedule Empty Url', this.getWorkscheduleEmptyUrl);
    const result = this.http.get<any[]>(this.getWorkscheduleEmptyUrl).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getWorkscheduleById(parameter: string): Observable<any> {
    console.log('Get Work Schedule By Id Url', this.getWorkscheduleURL + '/' + parameter);
    let WorkscheduleURL = this.getWorkscheduleURL;
    if (this.isRemoteURL) { WorkscheduleURL = this.getWorkscheduleURL + '/' + parameter; }
    const result = this.http.get<any>(WorkscheduleURL).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public createWorkschedule(workSchedule: any): Observable<any> {
    console.log('Create Work Schedule Url', this.getWorkscheduleURL);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.getWorkscheduleURL, workSchedule, { headers: httpHeaders, observe: 'response' });
  }

  public updateWorkschedule(workSchedule: any): Observable<any> {
    console.log('Update Work Schedule Url', this.getWorkscheduleURL, workSchedule);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getWorkscheduleURL, workSchedule, { headers: httpHeaders, observe: 'response' });
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
