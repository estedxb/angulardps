import { Component, OnInit } from '@angular/core';
import { FileuploadService } from 'src/app/shared/fileupload.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  fileToUpload: File = null;
  FileUploadForm: FormGroup;

  constructor(private fileUploadService: FileuploadService) { }

ngOnInit() {
    this.FileUploadForm = new FormGroup({
      file: new FormControl('', [Validators.required])
    });
  }

  handleFileInput(files: FileList) {
    if(files.length>0)
    {
     if( files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg' || files.item(0).type === 'image/png' )
      this.fileToUpload = files.item(0);
   
    }
    
}
 

uploadFileToActivity() {
  this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
    // do something, if upload success
    }, error => {
      console.log(error);
    });
}

}
