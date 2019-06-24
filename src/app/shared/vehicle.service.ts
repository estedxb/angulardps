import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class vehicleService {
  private getVehicleUrl = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getVehicles !== '') {
      this.getVehicleUrl = environment.boemmAPI + environment.getVehicles;
    } else {
      this.getVehicleUrl = environment.getAssetsDataPath + 'vehicles.json';
    }
    // this.logger.log('Data From = ' + this.getStatuteUrl);
  }

  public getVehicles(): Observable<any> {
    this.logger.log("getVehicles url="+this.getVehicleUrl);
    const result = this.http.get<any>(this.getVehicleUrl).catch(this.errorHandler);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}
