import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LegalForm } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LegalformService {
  private getLegalFormUrl = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getLegalForm !== '') {
      this.getLegalFormUrl = environment.dpsAPI + environment.getLegalForm;
    } else {
      this.getLegalFormUrl = '../../assets/data/legalform.json';
    }
  }

  public getLegalForms(): Observable<LegalForm[]> {
    console.log('LegalformService Data From = ' + this.getLegalFormUrl);
    const result = this.http.get<LegalForm[]>(this.getLegalFormUrl).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }
}

/*
  list(): Observable<LegalForm[]> {
    return this.http.get(this.getLegalFormUrl).pipe(
      map((data: any[]) => data.map((item: any) => new LegalForm(
        item.id,
        item.code,
        item.name,
        new Date(item.created),
      ))),
    );
*/
