import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { WorkSchedule } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkschedulesService {

  private getWorkscheduleByVatNumberUrl = '';
  private getWorkscheduleURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getWorkSchedulesByVatNumber !== '') {
      console.log('Data From Remote');
      this.getWorkscheduleByVatNumberUrl = environment.dpsAPI + environment.getWorkSchedulesByVatNumber;
      this.getWorkscheduleURL = environment.dpsAPI + environment.getWorkSchedule;
    } else {
      console.log('Data From JSON');
      this.getWorkscheduleByVatNumberUrl = '../../assets/data/workschedules.json';
    }
  }

  public getWorkscheduleByVatNumber(parameter: string): Observable<WorkSchedule[]> {
    console.log('getWorkscheduleByVatNumber');
    const result = this.http.get<WorkSchedule[]>(this.getWorkscheduleByVatNumberUrl + '/' + parameter).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getWorkscheduleById(parameter: string): Observable<WorkSchedule> {
    console.log('getWorkscheduleById');
    const result = this.http.get<any>(this.getWorkscheduleURL + '/' + parameter).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public createWorkschedule(workSchedule: any): Observable<any> {
    console.log('createWorkschedule');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.getWorkscheduleURL, workSchedule, {
      headers: httpHeaders, observe: 'response'
    });
  }

  public updateWorkschedule(workSchedule: any): Observable<any> {
    console.log('updateWorkschedule');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(this.getWorkscheduleURL, workSchedule, {
      headers: httpHeaders, observe: 'response'
    });
  }

  errorHandler(error: HttpErrorResponse) {
    // console.log(error.status);
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
