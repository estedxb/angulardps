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
  private getLocationURL = '';

  constructor(private http: HttpClient) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getLocationsByVatNumber !== '') {
      // console.log('Data From Remote');
      this.getLocationByVatNumberUrl = environment.dpsAPI + environment.getLocationsByVatNumber;
      this.getLocationURL = environment.dpsAPI + environment.getLocation;
    } else {
      // console.log('Data From JSON');
      this.getLocationByVatNumberUrl = environment.getAssetsDataPath + 'locations.json';
    }
  }

  public getLocationByVatNumber(parameter: string): Observable<Location[]> {
    // console.log('getLocationByVatNumber');
    const result = this.http.get<Location[]>(this.getLocationByVatNumberUrl + '/' + parameter).catch(this.errorHandler);
    // console.log(result);
    return result;
  }

  public getLocationById(parameter: string): Observable<Location> {
    // console.log('getLocationById');
    const result = this.http.get<any>(this.getLocationURL + '/' + parameter).catch(this.errorHandler);
    // console.log(result);
    return result;
  }

  public createLocation(location: Location): Observable<any> {
    // console.log('Create Location Url', this.getLocationURL);
    // console.log('createLocation', location);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.getLocationURL, location, { headers: httpHeaders, observe: 'response' });
  }

  public updateLocation(location: Location): Observable<any> {
    // console.log('Update Location Url', this.getLocationURL);
    // console.log('updateLocation', location);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.getLocationURL, location, { headers: httpHeaders, observe: 'response' });
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
