import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { WorkSchedule, DpsWorkSchedule } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class WorkschedulesService {

  private isRemoteURL = false;
  private getWorkscheduleByVatNumberUrl = '';
  private getWorkscheduleEmptyUrl = '';
  private getWorkscheduleURL = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    //environment.getWorkSchedulesByVatNumber = '';
    if (environment.dataFromAPI_JSON && environment.getWorkSchedulesByVatNumber !== '') {
      // this.logger.log('Data Work Schedules From Remote');
      this.isRemoteURL = true;
      this.getWorkscheduleByVatNumberUrl = environment.dpsAPI + environment.getWorkSchedulesByVatNumber;
      this.getWorkscheduleURL = environment.dpsAPI + environment.getWorkSchedule;
      this.getWorkscheduleEmptyUrl = environment.getAssetsDataPath + environment.getWorkscheduleEmpty;
    } else {
      this.logger.log('Data Work Schedules From JSON');
      this.isRemoteURL = false;
      this.getWorkscheduleByVatNumberUrl = environment.getAssetsDataPath + 'workschedules.json';
      this.getWorkscheduleEmptyUrl = environment.getAssetsDataPath + 'workschedules_empty.json';
    }
  }

  public getWorkscheduleByVatNumber(parameter: string): Observable<DpsWorkSchedule[]> {
    let WorkscheduleByVatNumberUrl = this.getWorkscheduleByVatNumberUrl;
    if (this.isRemoteURL) { WorkscheduleByVatNumberUrl = this.getWorkscheduleByVatNumberUrl + '/' + parameter; }
    // this.logger.log('Get Work Schedule By Vat Number Url', WorkscheduleByVatNumberUrl);
    const result = this.http.get<any[]>(WorkscheduleByVatNumberUrl).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

  public getWorkscheduleEmpty(parameter: string = ''): Observable<any[]> {
    // this.logger.log('Get Work Schedule Empty Url', this.getWorkscheduleEmptyUrl);
    const result = this.http.get<any[]>(this.getWorkscheduleEmptyUrl).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

  public getWorkscheduleById(parameter: string): Observable<any> {
    // this.logger.log('Get Work Schedule By Id Url', this.getWorkscheduleURL + '/' + parameter);
    let WorkscheduleURL = this.getWorkscheduleURL;
    if (this.isRemoteURL) { WorkscheduleURL = this.getWorkscheduleURL + '/' + parameter; }
    const result = this.http.get<any>(WorkscheduleURL).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

  public createWorkschedule(workSchedule: any): Observable<any> {
    // this.logger.log('Create Work Schedule Url', this.getWorkscheduleURL);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.getWorkscheduleURL, workSchedule, { headers: httpHeaders, observe: 'response' });
  }

  public updateWorkschedule(workSchedule: any): Observable<any> {
    // this.logger.log('Update Work Schedule Url', this.getWorkscheduleURL, workSchedule);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getWorkscheduleURL, workSchedule, { headers: httpHeaders, observe: 'response' });
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
