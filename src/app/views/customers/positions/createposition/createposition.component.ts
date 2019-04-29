import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User, DpsUser, LoginToken, DpsPostion } from '../../../../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
import { FileuploadService } from 'src/app/shared/fileupload.service';
@Component({
  selector: 'app-createposition',
  templateUrl: './createposition.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatepositionComponent implements OnInit {
  PositionForm: FormGroup;
  fileToUpload: File = null;
  PositionData: any;
  dpsPosition: DpsPostion;
  public isStudentAllowed;

  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  @Input('parentData') public PositionId;

  constructor(private positionsService: PositionsService, private fileuploadService :FileuploadService ) { }

  ngOnInit() {

    this.PositionForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      taskDescription: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      costCenter: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]+$')]),
      file: new FormControl('', [Validators.required])


    });
    this.loadPositionsToEdit(this.VatNumber);
    this.createObjects();  // check validations 
  }

  loadPositionsToEdit(VatNumber: string) {
    this.positionsService.getPositionsByVatNumber(VatNumber).subscribe(response => {
      response.forEach((element) => {
        let object = element.position;
        if (element.id === this.PositionId) {
          this.PositionForm.controls.name.setValue(object.name);
          this.PositionForm.controls.taskDescription.setValue(object.taskDescription);
          this.PositionForm.controls.costCenter.setValue(object.costCenter);
          // this.PositionForm.controls.isStudentAllowed.setValue(object.isStudentAllowed);
          this.isStudentAllowed = object.isStudentAllowed;
        }
      })
    });
  }

  onChange($event) {
    this.dpsPosition.position.isStudentAllowed = $event;
  }

  createObjects() {
    this.dpsPosition = new DpsPostion();
    // dpsPosition object
    this.dpsPosition.customerVatNumber = this.VatNumber;
    this.dpsPosition.id = this.PositionId;
    this.dpsPosition.isArchived = false;
    this.dpsPosition.isEnabled = true;
    this.dpsPosition.position.costCenter = this.PositionForm.get('costCenter').value;
    this.dpsPosition.position.taskDescription = this.PositionForm.get('taskDescription').value;
    this.dpsPosition.position.name = this.PositionForm.get('name').value;
    this.dpsPosition.position.workstationDocument = this.PositionForm.get('file').value;
    this.setJSONObject();
  }



  setJSONObject() {
    this.PositionData = {
      id: this.dpsPosition.id,
      customerVatNumber: this.dpsPosition.customerVatNumber,
      position: this.dpsPosition.position,
      isEnabled: this.dpsPosition.isEnabled,
      isArchived: this.dpsPosition.isArchived
    };
  }

  public updateData() {
    this.createObjects();
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

  onSaveUserClick() {

    this.updateData();

    console.log('PositionData=' + this.PositionData);
    console.log(this.PositionData);

    if (this.PositionData !== undefined && this.PositionData !== null) {
      console.log(this.PositionData);
      // check if username has value
      // if username has value ==> Update User
      // if username is null ==> Create User
      if (this.PositionId !== undefined && this.PositionData !== null) {
        // Update User
        this.positionsService.updatePosition(this.PositionId).subscribe(res => {
          console.log('response :: ');
          console.log(res);
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
        // Create User
        this.positionsService.createPosition(this.PositionData).subscribe(res => {
          console.log('response :: ');
          console.log(res);
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

}
