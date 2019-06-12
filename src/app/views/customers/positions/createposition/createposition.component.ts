import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _Position, DpsUser, DpsPostion, Documents } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
import { FileuploadService } from 'src/app/shared/fileupload.service';
import { environment } from '../../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { saveAs } from 'file-saver';
import { LoggingService } from '../../../../shared/logging.service';

@Component({
  selector: 'app-createposition',
  templateUrl: './createposition.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatepositionComponent implements OnInit {
  public currentPosition: DpsPostion;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  public isStudentAllowed: boolean;

  PositionForm: FormGroup;
  position: _Position;
  fileToUpload: File = null;
  workstationDocument: Documents;

  public getPositionUpdateUrl;
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder, private fileuploadService: FileuploadService, private positionsService: PositionsService,
    public dialogRef: MatDialogRef<CreatepositionComponent>, @Inject(MAT_DIALOG_DATA) public posistionData: DpsPostion, private logger: LoggingService) {
    this.currentPosition = posistionData;
  }

  ngOnInit() {
    this.logger.log('Current Position :: ', this.currentPosition);
    this.logger.log('Current VatNumber : ' + this.VatNumber);

    this.PositionForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      taskDescription: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      costCenter: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]+$')]),
      file: new FormControl('')
    });
    this.loadPositionsToEdit();

  }

  loadPositionsToEdit() {
    this.logger.log('before');
    this.logger.log(this.currentPosition);

    if (this.currentPosition.id !== undefined || this.currentPosition.id !== 0) {
      this.PositionForm.controls.name.setValue(this.currentPosition.position.name);
      this.PositionForm.controls.taskDescription.setValue(this.currentPosition.position.taskDescription);
      this.PositionForm.controls.costCenter.setValue(this.currentPosition.position.costCenter);
      // this.PositionForm.controls.isStudentAllowed.setValue(this.currentPosition.position.isStudentAllowed);
      this.isStudentAllowed = this.currentPosition.position.isStudentAllowed;
      this.createObjects();
    } else {
      this.currentPosition.id = 0;
    }

  }

  onChange($event) {
    this.currentPosition.position.isStudentAllowed = $event;
    this.logger.log('after');
    this.logger.log(this.currentPosition);
  }

  public updateData() {
    this.createObjects();
  }


  createObjects() {
    this.currentPosition.position.name = this.PositionForm.get('name').value;
    this.currentPosition.position.taskDescription = this.PositionForm.get('taskDescription').value;
    this.currentPosition.position.costCenter = this.PositionForm.get('costCenter').value;
    this.currentPosition.position.isStudentAllowed = this.currentPosition.position.isStudentAllowed;
  }

  public getJSONObject() {
    if (this.currentPosition !== undefined && this.currentPosition !== null) {
      return this.currentPosition;
    }
  }

  downloadFile() {
    this.currentPosition.position.workstationDocument.location = environment.blobStorage + '/' + environment.getPositionsDownloadTemplate;
    saveAs(this.currentPosition.position.workstationDocument.location);
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.fileToUpload = files.item(0);
      }
      if (this.fileToUpload !== null) {
        this.currentPosition.position.workstationDocument.name = files.item(0).name;
        this.currentPosition.position.workstationDocument.location = environment.blobStorage + '/' + environment.getPositionFileUploads + '' + files.item(0).name;
      }
    }
  }

  uploadFileToActivity() {
    //this.logger.log('fileToUpload ::::::::' + this.fileToUpload.name);
    if (this.fileToUpload !== null) {
      this.positionsService.updatePositionWithFile(this.fileToUpload, this.VatNumber, this.currentPosition.id).subscribe(data => {
        // do something, if upload success
      }, error => {
        this.logger.log(error);
      });
    }
  }




  onSavePositionClick() {
    this.createObjects();
    this.logger.log('PositionData=' + this.currentPosition);
    if (this.PositionForm.valid) {
      if (this.currentPosition !== undefined && this.currentPosition !== null) {
        this.logger.log('currentPosition.id =' + this.currentPosition.id);
        if (this.currentPosition.id !== undefined && this.currentPosition.id !== null && this.currentPosition.id > 0) {
          // Update Position         
          this.positionsService.updatePosition(this.currentPosition).subscribe(res => {
            this.logger.log('Update Position Response :: ', res);
            this.uploadFileToActivity();
            this.dialogRef.close(this.currentPosition);

          },
            (err: HttpErrorResponse) => {

              this.logger.log('Error :: ');
              this.logger.log(err);
              if (err.error instanceof Error) {
                this.logger.log('Error occured=' + err.error.message);
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
              }
            }
          );

        } else {
          // Create Position
          this.logger.log('Create Position');
          this.positionsService.createPosition(this.currentPosition).subscribe(res => {
            this.logger.log('create Position  Response :: ', res.body);
            this.currentPosition.id = res.body;
            this.uploadFileToActivity();
            this.dialogRef.close(this.currentPosition);


          },
            (err: HttpErrorResponse) => {

              this.logger.log('Error :: ');
              this.logger.log(err);
              if (err.error instanceof Error) {
                this.logger.log('Error occured=' + err.error.message);
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
              }
            }
          );
        }
      }
    } else {
      this.logger.log('Form is Not Vaild');
    }
  }
}
