import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AADUserGroups, UserGroups } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class AADUserGroupService {

  private getAADUserGroupUrl = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getAADUserGroupUrl !== '') {
      console.log('Data From Remote');
      this.getAADUserGroupUrl = environment.dpsAPI + environment.getAADUserGroupUrl;
    } else {
      console.log('Data From JSON');
      this.getAADUserGroupUrl = environment.getAssetsDataPath + 'groupsdetails.json';
    }
  }

  public getAADUserGroupDetails(idToken: string): Observable<AADUserGroups> {
    console.log('getAADUserGroupUrl', this.getAADUserGroupUrl + '?userAccessToken=' + idToken);
    const result = this.http.get<AADUserGroups>(this.getAADUserGroupUrl + '?userAccessToken=' + idToken).catch(this.errorHandler);
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
