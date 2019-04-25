import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {


  constructor(private http: HttpClient) { }


  postFile(fileToUpload: File): Observable<boolean> {
    const endpoint = 'your-destination-url';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.post(endpoint, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => { return true; }))
      .catch((e) => this.handleError(e));
}
  handleError(e: any): import("rxjs").ObservableInput<boolean> {
    throw new Error("Method not implemented.");
  }
  
}


