import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { LegalForm } from '../models/legalform';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
//import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class LegalformService {
  private getLegalFormUrl = 'assets/data/legalform.json';
  //private getLegalFormUrl = environment.apiURL + environment.getJointCommitee;

  constructor(private http: HttpClient) { }

  public getLegalForms(): Observable<LegalForm[]> { 
    return this.http.get<LegalForm[]>(this.getLegalFormUrl).catch(this.errorHandler); 
  }

  errorHandler(error: HttpErrorResponse){ return Observable.throw(error.message); }

}
