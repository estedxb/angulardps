import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CustomersList } from './models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class CustomerListsService {

  private getCustomerListUrl = '';

  constructor(private http: HttpClient, private logger: LoggingService) { // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getCustomerLists !== '') {
      this.getCustomerListUrl = environment.dpsAPI + environment.getCustomerLists;
    } else {
      this.getCustomerListUrl = environment.getAssetsDataPath + 'customerlists.json';
    }
    // this.logger.log('Data From = ' + this.getCustomerListUrl);
  }

  public getCustomers(): Observable<CustomersList[]> {
    // this.logger.log('CustomerListsService Data From = ' + this.getCustomerListUrl);
    const result = this.http.get<CustomersList[]>(this.getCustomerListUrl).catch(this.errorHandler);
    // this.logger.log(result);
    return result;
  }

  errorHandler(error: HttpErrorResponse) { return Observable.throwError(error.message); }

}
