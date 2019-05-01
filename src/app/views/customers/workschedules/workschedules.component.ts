import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { WorkSchedule, LoginToken, DpsUser, DpsWorkSchedule, WorkDays, WorkTimes, BreakTimes } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from '../../../shared/workschedules.service';
import { CreateworkscheduleComponent } from './createworkschedule/createworkschedule.component';

@Component({
  selector: 'app-workschedules',
  templateUrl: './workschedules.component.html',
  styleUrls: ['./../customers.component.css']
})
export class WorkschedulesComponent implements OnInit {
  public maindatas = [];
  public data: DpsWorkSchedule;
  public workSchedule: WorkSchedule;
  public workDays: WorkDays[] = [];
  public workTimes: WorkTimes[] = [];
  public errorMsg;
  public SelectedIndex = -1;
  public SelectedEnableStatus = true;
  public durationInSeconds = 5;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(
    private workschedulesService: WorkschedulesService,
    private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.workschedulesService.getWorkscheduleByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(dpsWorkSchedules => {
      this.maindatas = dpsWorkSchedules;
      console.log('Work Schedule Forms Data : ', this.maindatas);
      this.FilterTheArchive();
      this.ShowMessage('Work Schedules is listed successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  FilterTheArchive() { this.maindatas = this.maindatas.filter(d => d.isArchived === false); }

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

      const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => {
        this.ShowMessage($event.MSG, $event.Action);
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
        console.log('this.SelectedIndex ::', this.SelectedIndex);
        if (this.SelectedIndex >= 0) {
          // maindatas Update Work Schedule
          this.maindatas[this.SelectedIndex] = this.data;
          this.FilterTheArchive();
          this.ShowMessage('Work Schedules "' + this.data + '" is updated successfully.', '');
        } else {
          // maindatas Add Work Schedule
          console.log('this.data.id :: ', this.data.id);
          if (parseInt('0' + this.data.id, 0) > 0) {
            this.maindatas.push(this.data);
            console.log('New Work Schedule Added Successfully :: ', this.maindatas);
            this.FilterTheArchive();
            this.ShowMessage('Work Schedules "' + this.data.name + '" is added successfully.', '');
          }
        }
      });
    } catch (e) { }
  }


  onClickAdd() {
    this.SelectedIndex = -1;
    this.data = new DpsWorkSchedule();
    this.workSchedule = new WorkSchedule();
    this.data.id = 0;
    this.data.name = '';
    this.data.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.data.isArchived = false;
    this.data.isEnabled = true;
    this.workSchedule.workDays = this.LoadEmptyWorkDays();
    this.data.workSchedule = this.workSchedule;
    console.log('onClickAdd EmptyData', this.data);
    this.openDialog();
  }

  LoadEmptyWorkDays() {
    for (let weekDay = 1; weekDay <= 7; weekDay++) {
      this.workDays.push(this.LoadEmptyWorkDayof(weekDay));
    }
    return this.workDays;
  }

  LoadEmptyWorkDayof(dayOfWeek) {
    const workDay = new WorkDays();
    workDay.dayOfWeek = parseInt(dayOfWeek, 0);
    this.workTimes.push(this.LoadEmptyWorkTime());
    this.workTimes.push(this.LoadEmptyWorkTime());
    workDay.workTimes = this.workTimes;
    workDay.breakTimes = null;
    return workDay;
  }
  LoadEmptyWorkTime() {
    const workTime = new WorkTimes();
    workTime.startTime = '00:00:00';
    workTime.endTime = '00:00:00';
    workTime.title = '';
    return workTime;
  }

  onClickEdit(i) {
    this.SelectedIndex = i;
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[i];
    this.openDialog();
    return true;
  }

  updateWorkschedules() {
    this.workschedulesService.updateWorkschedule(this.data).subscribe(res => {
      console.log('response :: ', res, 'Data ::', this.data);
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
    this.updateWorkschedules();
    this.ShowMessage('Work Schedules "' + this.data.name + '" is deleted successfully.', '');
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    console.log('Work Schedule index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updateWorkschedules();
    let EnabledStatus = '';
    if (event) { EnabledStatus = 'enabled'; } else { EnabledStatus = 'disabled'; }
    this.ShowMessage('Work Schedules "' + this.data.name + '" is ' + EnabledStatus + ' successfully.', '');
  }
}
