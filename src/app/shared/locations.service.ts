import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from './models';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private getLocationByVatNumberUrl = '';
  private updateLocationURL = '';
  private createLocationURL = '';
  private getLocationByIdURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getLocations !== '') {
      console.log('Data From Remote');
      this.getLocationByVatNumberUrl = environment.dpsAPI + environment.getLocations;
      this.createLocationURL = environment.dpsAPI + environment.getLocations;
      this.updateLocationURL = environment.dpsAPI + environment.getLocations;
      this.getLocationByIdURL = environment.dpsAPI + environment.getLocations;
    } else {
      console.log('Data From JSON');
      this.getLocationByVatNumberUrl = '../../assets/data/locations.json';
    }
  }

  public getLocationByVatNumber(parameter: string): Observable<Location[]> {
    console.log('hello');
    const result = this.http.get<Location[]>(this.getLocationByVatNumberUrl + '/' + parameter).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public getLocationById(parameter: string): Observable<Location> {
    console.log('hello');

    const result = this.http.get<any>(this.getLocationByIdURL + '/' + parameter).catch(this.errorHandler);
    console.log(result);
    return result;
  }

  public createLocation(location: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.createLocationURL, location, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  public updateLocation(location: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(this.updateLocationURL, location, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  errorHandler(error: HttpErrorResponse) {
    // console.log(error.status);

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
