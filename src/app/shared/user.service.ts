import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { User, DpsUser } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private getUserByVatNumberUrl = "";
  private createUserURL = "";
  private updateUserURL = "";

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getUsers !== '') {
      console.log('Data From Remote');
      this.updateUserURL = environment.dpsAPI + environment.getUsers;
      this.getUserByVatNumberUrl = environment.dpsAPI + environment.getUsers;
      this.createUserURL = environment.dpsAPI + environment.getUsers;
    } else {
      console.log('Data From JSON');
      this.getUserByVatNumberUrl = 'User/User/test1';
    }  
  }

   public getUsersByVatNumber(parameter:string): Observable<DpsUser[]> {
    console.log('UserService Data From = ' + this.getUserByVatNumberUrl);
    const result =  this.http.get<DpsUser[]>(this.getUserByVatNumberUrl + '/'+parameter).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public createUser(user:any): Observable<any>
  {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

   return this.http.post<any>(this.createUserURL,user, {
      headers: httpHeaders,
      observe: 'response'
   });
  }

  public updateUser(user:any): Observable<any>
  {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

   return this.http.put<any>(this.updateUserURL,user, {
      headers: httpHeaders,
      observe: 'response'
   });
  }

  errorHandler(error: HttpErrorResponse) { 
    console.log(error.status);

    if(error.status === 400)
      console.log("vat number not correct format");
    if(error.status === 204)
      console.log("vat number doesnt exist ");
    if(error.status === 409)
      console.log('user exists in the system, dont allow customer to create');

    return Observable.throwError(error.message); 
  }
}
