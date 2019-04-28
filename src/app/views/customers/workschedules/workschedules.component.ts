import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { WorkSchedule, LoginToken, DpsUser } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from '../../../shared/workschedules.service';
import { CreateworkscheduleComponent } from './createworkschedule/createworkschedule.component';

@Component({
  selector: 'app-workschedules',
  templateUrl: './workschedules.component.html',
  styleUrls: ['./../customers.component.css']
})
export class WorkschedulesComponent implements OnInit {
  public WorkScheduleid = 1;
  public maindatas = [];
  public data;
  public errorMsg;
  public SelectedIndex = 0;
  public SelectedStatus = true;
  public durationInSeconds = 5;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private workschedulesService: WorkschedulesService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.workschedulesService.getWorkscheduleByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(workschedules => {
      this.maindatas = workschedules;
      console.log('Work Schedule Forms Data : '); console.log(this.maindatas);
      this.ShowMessage('Work Schedules fetched successfully.', '');
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
      dialogConfig.width = '800px';
      dialogConfig.data = this.data;
      dialogConfig.ariaLabel = 'Arial Label Work Schedule Dialog';

      const dialogRef = this.dialog.open(CreateworkscheduleComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
      });
    } catch (e) { }
  }

  onClickAdd() {
    this.data = new WorkSchedule();
    this.openDialog();
  }

  onClickEdit(i) {
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[i];
    this.openDialog();
    return true;
  }

  updateWorkschedules() {
    this.workschedulesService.updateWorkschedule(this.data).subscribe(res => {
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
    this.updateWorkschedules();
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    console.log('Location index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updateWorkschedules();
  }
}
