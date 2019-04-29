import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { _Position, LoginToken, DpsUser } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from '../../../shared/positions.service';
import { CreatepositionComponent } from './createposition/createposition.component';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./../customers.component.css']
})
export class PositionsComponent implements OnInit {
  public PositionId = 1;
  public maindatas = [];
  public data;
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
      console.log('Positions Form Data : '); console.log(this.maindatas);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
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
      });
    } catch (e) { }
  }

  onClickAdd() {
    this.data = new _Position();
    this.openDialog();
  }

  onClickEdit(i) {
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[i];
    this.openDialog();
    return true;
  }

  updatePositions() {
    this.positionsService.updatePosition(this.data).subscribe(res => {
      console.log('response :: ');
      console.log(res);
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

  onClickDelete(i) {
    console.log('Delete Clicked Index:: ' + i);
    this.data = this.maindatas[i];
    this.data.isArchive = true;
    this.updatePositions();
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    console.log('Location index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updatePositions();
  }
}
