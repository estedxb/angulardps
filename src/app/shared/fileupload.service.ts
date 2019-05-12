import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  private getFileUploadsURL = '';


  constructor(private http: HttpClient) {
    // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getFileUploads !== '') {
      console.log('Data From Remote');
      this.getFileUploadsURL = environment.dpsAPI + environment.getPosition;

    } else {
      console.log('Data From JSON');
      this.getFileUploadsURL = '';
    }
  }


  updatePositionFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.put(this.getFileUploadsURL, formData, { headers: httpHeaders, observe: 'response' }).pipe(map(() => true))
      .catch((e) => this.handleError(e));
  }
  handleError(e: any): import('rxjs').ObservableInput<boolean> {
    throw new Error('Method not implemented.');
  }

}


