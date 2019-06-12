import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  public getPositionUpdateUrl;
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();


  constructor(private http: HttpClient, private logger: LoggingService) {
    // , private header: HttpHeaders
    if (environment.dataFromAPI_JSON && environment.getFileUploads !== '') {
      this.logger.log('Data From Remote');
      // this.getFileUploadsURL = environment.dpsAPI + environment.getPosition;

    } else {
      this.logger.log('Data From JSON');
      // this.getFileUploadsURL = '';
    }
  }

  public updatePositionFile(position: any, fileToUpload: File): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    const formData: FormData = new FormData();

    //formData.append('data', JSON.stringify(position));
    if (fileToUpload.size > 0) {
      formData.append('file', fileToUpload, fileToUpload.name);
    }

    this.logger.log('formData:::', formData);
    new Response(formData).text().then(console.log)

    return this.http.post<any>(this.getPositionUpdateUrl, /*JSON.stringify(position)+""+*/ formData, {
      headers: httpHeaders,
      observe: 'response'
    });
  }


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post('https://dpsapisdev.azurewebsites.net/api/Position/Update', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });
  }

}


