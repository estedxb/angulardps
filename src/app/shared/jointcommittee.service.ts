import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { JointCommittee } from '../models/jointcommittee';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
//import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class JointcommitteeService {
  private getJointCommiteeUrl = 'assets/data/jointcommittee.json';
  //private getJointCommiteeUrl = environment.apiURL + environment.getJointCommitee;

  constructor(private http: HttpClient) { }

  public getJointCommitees(): Observable<JointCommittee[]> { 
    return this.http.get<JointCommittee[]>(this.getJointCommiteeUrl).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse){ return Observable.throw(error.message); }

}
