import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileuploadService } from 'src/app/shared/fileupload.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpEventType, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileUploadComponent implements OnInit {
  fileToUpload: File = null;
  FileUploadForm: FormGroup;


  public getPositionUpdateUrl;
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();


  constructor(private fileUploadService: FileuploadService, private http: HttpClient) { }

  ngOnInit() {
    this.FileUploadForm = new FormGroup({
      file: new FormControl('', [Validators.required])
    });
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let position = {
      "customerVatNumber": "123456789101",
      "id": 0,
      "isArchived": false,
      "isEnabled": true,
      "position": {
          "costCenter": "test",
          "isStudentAllowed": false,
          "name": "test",
          "taskDescription": "test",
          "workstationDocument": {
              "name": "",
              "location": ""
          }
      }
  }
 
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name, );
 
    this.http.post('https://dpsapisdev.azurewebsites.net/api/Position/uploadDocument/123456789101/5',  formData, {reportProgress: true, observe: 'events'})
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
