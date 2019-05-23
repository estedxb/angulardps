import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Language } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private getLanguagesUrl = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getLanguages !== '') {
      this.getLanguagesUrl = environment.dpsAPI + environment.getLanguages;
    } else {
      this.getLanguagesUrl = '../../assets/data/languages.json';
    }
  }

  public getLanguages(): Observable<Language[]> {
    // console.log('LanguagesService Data From = ' + this.getLanguagesUrl);
    const result = this.http.get<Language[]>(this.getLanguagesUrl).catch(this.errorHandler);
    // console.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }
}
