import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User, DpsUser, DpsPostion } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class PositionsService {
  private getPositionsByVatNumberUrl = '';
  private getPositionUrl = '';
  private getPositionUpdateUrl = '';


  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'my-auth-token' }) };

  constructor(private http: HttpClient, private logger: LoggingService) {
    if (environment.dataFromAPI_JSON && environment.getPositionsByVatNumber !== '') {
      // this.logger.log('Data From Remote');
      this.getPositionsByVatNumberUrl = environment.dpsAPI + environment.getPositionsByVatNumber;
      this.getPositionUrl = environment.dpsAPI + environment.getPosition;
      this.getPositionUpdateUrl = environment.dpsAPI + environment.getPositionUpdate;


    } else {
      this.logger.log('Data From JSON');
      this.getPositionsByVatNumberUrl = environment.getAssetsDataPath + 'positions.json';
    }
  }

  public getPositionsByVatNumber(parameter: string): Observable<DpsPostion[]> {
    // this.logger.log('PositionsService Data From = ' + this.getPositionsByVatNumberUrl + '/' + parameter);
    const result = this.http.get<DpsPostion[]>(
      this.getPositionsByVatNumberUrl + '/' + parameter, this.httpOptions).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

  public createPosition(position: any): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.getPositionUrl, position, {
      headers: httpHeaders,
      observe: 'response'
    });
  }
  public updatePosition(position: any): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getPositionUrl, position, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  public updatePositionWithFile(fileToUpload: File, vatNumber: string, positionId: number): Observable<any> {
    // if ( fileToUpload.size > 0)
    // {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    // this.logger.log('formData:::', formData);
    new Response(formData).text().then(console.log);
    return this.http.post<any>(this.getPositionUpdateUrl + '/' + vatNumber + '/' + positionId, formData,
      {
        observe: 'response'
      });
    //  }
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


