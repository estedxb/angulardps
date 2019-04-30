import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { _Position, DpsPostion, LoginToken, DpsUser, Documents } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from '../../../shared/positions.service';
import { CreatepositionComponent } from './createposition/createposition.component';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./../customers.component.css']
})
export class PositionsComponent implements OnInit {
  public maindatas = [];
  public data : DpsPostion;
  public position : _Position;
  public workstationDocument: Documents;
  public errorMsg;
  public SelectedIndex = 0;
  public SelectedEnableStatus = true;
  public durationInSeconds = 5;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private positionsService: PositionsService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      console.log('Positions Form Data : ', this.maindatas);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  FilterTheArchive()
  {
    this.maindatas = this.maindatas.filter(d => d.isArchived === false);
  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      console.log('Snackbar Action :: ' + Action);
    });
  }

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.data;
      dialogConfig.ariaLabel = 'Arial Label Positions Dialog';

      const dialogRef = this.dialog.open(CreatepositionComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
        if (this.SelectedIndex >0){           
            this.maindatas[this.SelectedIndex] = this.data;          
            this.FilterTheArchive();   
        } else {    
          console.log('this.data.id :: ' , this.data.id);
          if(parseInt('0' + this.data.id)>0){
            this.maindatas.push(this.data); 
            console.log(' new this.maindatas :: ', this.maindatas);
            this.FilterTheArchive();                 
          }
        }
      });
    } catch (e) { }
  }

  onClickAdd() {
    this.SelectedIndex =0;
    
    this.data = new DpsPostion();
    this.position = new _Position();
    this.workstationDocument = new Documents();

    this.workstationDocument.name = '';
    this.workstationDocument.location = '';

    this.position.costCenter = '';    
    this.position.isStudentAllowed = false;
    this.position.name = '';
    this.position.taskDescription = '';
    this.position.workstationDocument = this.workstationDocument;
    
    this.data.customerVatNumber = this.loginuserdetails.customerVatNumber ;
    this.data.id = 0;
    this.data.isArchived = false;
    this.data.isEnabled =true;

    this.data.position = this.position;  
    this.openDialog();
  }

  onClickEdit(i) {
    this.SelectedIndex = i;
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[this.SelectedIndex];
    this.openDialog();
    return true;
  }

  updatePositions() {
    this.positionsService.updatePosition(this.data).subscribe(res => {
      console.log('response :: ', res, "Data ::", this.data);
      this.maindatas[this.SelectedIndex] = this.data;
      this.FilterTheArchive();
    },
    (err: HttpErrorResponse) => {
      console.log('Error :: ', err);
      if (err.error instanceof Error) {
        console.log('Error occured=' + err.error.message);
      } else {
        console.log('response code=' + err.status, 'response body=' + err.error);
      }
    }
  );
}

  onClickDelete(i) {
    console.log('Delete Clicked Index:: ' + i);
    this.data = this.maindatas[i];
    this.data.isArchived = true;
    this.updatePositions();
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    console.log('Position index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updatePositions();
  }
}
