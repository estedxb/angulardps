import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _Position, DpsUser, DpsPostion, Documents } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
import { FileuploadService } from 'src/app/shared/fileupload.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
//import { saveAs } from 'file-saver';

@Component({
  selector: 'app-createposition',
  templateUrl: './createposition.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatepositionComponent implements OnInit {
  public currentPosition: DpsPostion;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber; 

  PositionForm: FormGroup;
  position : _Position
  fileToUpload: File = null;
  workstationDocument : Documents;
 
  constructor(private formBuilder: FormBuilder,private fileuploadService: FileuploadService,private positionsService: PositionsService,  public dialogRef: MatDialogRef<CreatepositionComponent>,@Inject(MAT_DIALOG_DATA) public posistionData: DpsPostion ) { 
    this.currentPosition = posistionData;
  }

  ngOnInit() {
    console.log('Current Position :: ' , this.currentPosition);
    console.log('Current VatNumber : ' + this.VatNumber);

    this.PositionForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      taskDescription: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      costCenter: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]+$')]),
      file: new FormControl('', [Validators.required])

    });
    this.loadPositionsToEdit();
  }

  loadPositionsToEdit(){
        if (this.currentPosition.id !== undefined || this.currentPosition.id!==0) {
          this.PositionForm.controls.name.setValue(this.currentPosition.position.name);
          this.PositionForm.controls.taskDescription.setValue(this.currentPosition.position.taskDescription);
          this.PositionForm.controls.costCenter.setValue(this.currentPosition.position.costCenter);
          this.PositionForm.controls.isStudentAllowed.setValue(this.currentPosition.position.isStudentAllowed);          
          this.createObjects(); 
        }
        else{
          this.currentPosition.id = 0;
        }    
  }

  onChange($event) {
    this.currentPosition.position.isStudentAllowed = $event;    
  }

  public updateData() {
    this.createObjects();
  }
 

  createObjects() {
    this.currentPosition.position.name = this.PositionForm.get('name').value;
    this.currentPosition.position.taskDescription = this.PositionForm.get('taskDescription').value;
    this.currentPosition.position.costCenter = this.PositionForm.get('costCenter').value;
    this.currentPosition.position.isStudentAllowed =  this.currentPosition.position.isStudentAllowed;
    //this.currentPosition.position.workstationDocument.name =  this.dpsPosition.position.isStudentAllowed;
    //this.currentPosition.position.workstationDocument.location =  this.dpsPosition.position.isStudentAllowed;
  }

  public getJSONObject() {
    if (this.currentPosition !== undefined && this.currentPosition !== null) {
      return this.currentPosition;
    }
  }

  downloadfile(url: string){
    //var FileSaver = require('file-saver');
    //FileSaver.saveAs(url,  "application/pdf;charset=utf-8");
  }

  handleFileInput(files: FileList) {
    if(files.length>0)
    {
     if( files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg' || files.item(0).type === 'image/png' )
      this.fileToUpload = files.item(0);   
    }    
} 

uploadFileToActivity() {
  this.fileuploadService.postFile(this.fileToUpload).subscribe(data => {
    // do something, if upload success
    }, error => {
      console.log(error);
    });
}

  onSavePositionClick() {
    this.createObjects();
    console.log('PositionData=' + this.currentPosition);
    if (this.PositionForm.valid){
    if (this.currentPosition !== undefined && this.currentPosition !== null) {   
      if (this.currentPosition.id !== undefined && this.currentPosition.id !== null) {
        console.log('Update Position');
        // Update Position
        this.positionsService.updatePosition(this.currentPosition).subscribe(res => {
          console.log('Update Location Response :: ', res);            
          this.dialogRef.close(this.currentPosition);
          this.uploadFileToActivity();
        },
          (err: HttpErrorResponse) => {

            console.log('Error :: ');
            console.log(err);
            if (err.error instanceof Error) {
              console.log('Error occured=' + err.error.message);
            } else {
              console.log('response code=' + err.status);
              console.log('response body=' + err.error);
            }
          }
        );

      } else {
        // Create Position
        console.log('Create Position'); 
        this.positionsService.createPosition(this.currentPosition).subscribe(res => {
          console.log('  Location Response :: ' , res.body);
          this.currentPosition.id = res.body;            
          this.dialogRef.close(this.currentPosition)
          
          this.uploadFileToActivity();
        },
          (err: HttpErrorResponse) => {

            console.log('Error :: ');
            console.log(err);
            if (err.error instanceof Error) {
              console.log('Error occured=' + err.error.message);
            } else {
              console.log('response code=' + err.status);
              console.log('response body=' + err.error);
            }
          }
        );
      }
    }
  }
  else {
    console.log('Form is Not Vaild');
}
  }

}
