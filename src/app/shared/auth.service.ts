import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Login, LoginToken } from './models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private getVerifyLoginUrl = '';
  public errorMsg;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  private httpParams: HttpParams = new HttpParams();
  constructor(private http: HttpClient, private logger: LoggingService) {
    if (environment.dataFromAPI_JSON && environment.verifylogin !== '') {
      this.getVerifyLoginUrl = environment.dpsAPI + environment.verifylogin;
    } else { this.getVerifyLoginUrl = environment.getAssetsDataPath + 'logintoken.json'; }
  }

  public verifyLogin(userid: string, Password: string): Observable<LoginToken> {
    try {
      // console.log('Verify Login Data From  = ' + this.getVerifyLoginUrl);
      const result = this.http.get<LoginToken>(this.getVerifyLoginUrl, this.httpOptions).catch(this.errorHandler);
      // console.log(result);
      return result;
    } catch (e) {
      console.log('Error verifyLogin !' + e.message);
      return null;
    }
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

  logout(): void {
    localStorage.removeItem('dpsLoginToken');
    console.log('Logout...');
  }
}
