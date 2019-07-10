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
    } else {
      this.logger.log('getPositionsByVatNumberUrl Data From JSON');
      this.getPositionsByVatNumberUrl = environment.getAssetsDataPath + 'positions.json';
    }
    if (environment.dataFromAPI_JSON && environment.getPosition !== '') {
      this.getPositionUrl = environment.dpsAPI + environment.getPosition;
    } else {
      this.logger.log('getPositionUrl Data From JSON');
      this.getPositionUrl = environment.getAssetsDataPath + 'positions.json';
    }

    this.getPositionUpdateUrl = environment.dpsAPI + environment.getPositionUpdate;
  }

  public getPositionsByVatNumber(vatNumber: string): Observable<DpsPostion[]> {
    // this.logger.log('PositionsService Data From = ' + this.getPositionsByVatNumberUrl + '/' + vatNumber);
    const result = this.http.get<DpsPostion[]>(
      this.getPositionsByVatNumberUrl + '/' + vatNumber, this.httpOptions).catch(this.errorHandler);
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


