import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _Position, DpsUser, DpsPostion, Documents, LoginToken } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
import { FileuploadService } from 'src/app/shared/fileupload.service';
import { environment } from '../../../../../environments/environment';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatSnackBarConfig } from '@angular/material';
import { saveAs } from 'file-saver';
import { LoggingService } from '../../../../shared/logging.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-createposition',
  templateUrl: './createposition.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatepositionComponent implements OnInit {
  public currentPosition: DpsPostion;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public VatNumber = this.dpsLoginToken.customerVatNumber;
  public isStudentAllowed: boolean;

  PositionForm: FormGroup;
  position: _Position;
  fileToUpload: File = null;
  fileToUploadName = '';
  workstationDocument: Documents;

  public getPositionUpdateUrl;
  public progress: number;
  public message: string;

  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder, private fileuploadService: FileuploadService,
    private positionsService: PositionsService, private snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    private logger: LoggingService, public dialogRef: MatDialogRef<CreatepositionComponent>,
    @Inject(MAT_DIALOG_DATA) public posistionData: DpsPostion) {
    this.currentPosition = posistionData;
  }

  ngOnInit() {
    this.logger.log('Current Position :: ', this.currentPosition);
    this.logger.log('Current VatNumber : ' + this.VatNumber);

    this.PositionForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      taskDescription: new FormControl(''),
      costCenter: new FormControl(''),
      file: new FormControl('')
    });
    this.loadPositionsToEdit();

  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      this.logger.log('Snackbar Action :: ' + Action);
    });
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
    if (this.PositionForm.get('costCenter').value !== null || this.PositionForm.get('costCenter').value !== undefined || this.PositionForm.get('costCenter').value !== "") {
      this.currentPosition.position.costCenter = this.PositionForm.get('costCenter').value;
    }
    else {
      this.currentPosition.position.costCenter = "0";
    }
    this.currentPosition.position.costCenter = this.PositionForm.get('costCenter').value;
    this.currentPosition.position.isStudentAllowed = this.currentPosition.position.isStudentAllowed;
  }

  public getJSONObject() {
    if (this.currentPosition !== undefined && this.currentPosition !== null) {
      return this.currentPosition;
    }
  }

  downloadUploadedFile(URL) {
    if (
      this.currentPosition.position.workstationDocument.location !== undefined &&
      this.currentPosition.position.workstationDocument.location !== null &&
      this.currentPosition.position.workstationDocument.location !== '') {
      this.logger.log('downloadUploadedFile :: ', this.currentPosition.position.workstationDocument.location);

      saveAs(this.currentPosition.position.workstationDocument.location, this.currentPosition.position.workstationDocument.name);
    } else {
      this.ShowMessage('File Url Not Found', '');
    }
  }

  // this.currentPosition.position.workstationDocument.location = environment.blobStorage + '/' + environment.getPositionsDownloadTemplate;

  downloadFile() { saveAs(environment.blobStorage + '/' + environment.getPositionsDownloadTemplate); }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') { this.fileToUpload = files.item(0); }

      if (this.fileToUpload !== null) { this.fileToUploadName = files.item(0).name; }
    }
  }

  uploadFileToActivity() {
    // this.logger.log('fileToUpload ::::::::' + this.fileToUpload.name);
    if (this.fileToUpload !== null) {
      this.positionsService.updatePositionWithFile(this.fileToUpload, this.VatNumber, this.currentPosition.id).subscribe(data => {
        this.logger.log('uploadFileToActivity()', data);
        this.setContractWorkstationDocumentInfo(data);
        this.dialogRef.close(this.currentPosition);
      }, error => {
        this.logger.log('uploadFileToActivity() Error - ', error);
        this.setContractWorkstationDocumentInfo(false);
        this.dialogRef.close(this.currentPosition);
      });
    } else {
      this.dialogRef.close(this.currentPosition);
    }
  }
  setContractWorkstationDocumentInfo(data: any) {
    try {
      const dataString = JSON.stringify(data).trim();
      if (dataString !== 'true' && dataString !== 'false') {
        this.currentPosition.position.workstationDocument.location = data.url;
        this.currentPosition.position.workstationDocument.name = data.name;
      } else {
        this.currentPosition.position.workstationDocument.location = '';
        this.currentPosition.position.workstationDocument.name = this.fileToUploadName;
      }
    } catch (e) {
      this.currentPosition.position.workstationDocument.location = '';
      this.currentPosition.position.workstationDocument.name = this.fileToUploadName;
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
            this.logger.log('create Position Response :: ', res);
            this.currentPosition.id = res.body;
            this.uploadFileToActivity();
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
