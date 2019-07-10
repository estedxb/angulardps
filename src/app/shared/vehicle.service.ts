import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class vehicleService {
  private getVehicleUrl = '';

  private getVehicleUrlNew = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getVehicles !== '') {
      this.getVehicleUrl = environment.boemmAPI + environment.getVehicles;
    } else {
      this.getVehicleUrl = environment.getAssetsDataPath + 'vehicles.json';
    }

    if (environment.dataFromAPI_JSON && environment.getVehicleUrlNew === '') {
      this.getVehicleUrlNew = environment.getAssetsDataPath + 'vehicles.json';
    }
    // console.log('Data From = ' + this.getStatuteUrl);
  }

  public getVehiclesNew(): Observable<any> {
    const result = this.http.get<any>(this.getVehicleUrlNew).catch(this.errorHandler);
    return result;
  }


  public getVehicles(): Observable<any> {
    const result = this.http.get<any>(this.getVehicleUrl).catch(this.errorHandler);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}
