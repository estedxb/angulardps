import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { WorkSchedule, LoginToken, DpsUser, DpsWorkSchedule, WorkDays, WorkTimes, BreakTimes } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from '../../../shared/workschedules.service';
import { CreateWorkScheduleComponent } from './createworkschedule/createworkschedule.component';
import { LoggingService } from '../../../shared/logging.service';

@Component({
  selector: 'app-workschedules',
  templateUrl: './workschedules.component.html',
  styleUrls: ['./../customers.component.css']
})
export class WorkSchedulesComponent implements OnInit {
  @Input() CustomerVatNumber: string;
  public maindatas = [];
  public data: DpsWorkSchedule;
  public workSchedule: WorkSchedule;
  public errorMsg;
  public SelectedIndex = -1;
  public SelectedEnableStatus = true;
  public durationInSeconds = 5;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  // public VatNumber = this.dpsLoginToken.customerVatNumber;

  constructor(
    private workschedulesService: WorkschedulesService, private logger: LoggingService,
    private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.logger.log('CustomerVatNumber ::', this.CustomerVatNumber);
    this.workschedulesService.getWorkscheduleByVatNumber(this.CustomerVatNumber).subscribe(dpsWorkSchedules => {
      this.maindatas = dpsWorkSchedules;
      this.logger.log('Work Schedule Forms Data : ', this.maindatas);
      this.FilterTheArchive();
      this.ShowMessage('Work Schedules is listed successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  FilterTheArchive() {
    this.maindatas = this.maindatas.filter(d => d.isArchived === false);
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

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '1000px';
      dialogConfig.data = this.data;
      dialogConfig.ariaLabel = 'Arial Label Work Schedule Dialog';

      const dialogRef = this.dialog.open(CreateWorkScheduleComponent, dialogConfig);

      const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => { this.ShowMessage($event.MSG, $event.Action); });

      dialogRef.afterClosed().subscribe(result => {
        this.logger.log('The dialog was closed');
        this.data = result;
        // this.logger.log('this.data ::', this.data);
        // this.logger.log('this.SelectedIndex ::', this.SelectedIndex);
        this.onPageInit();
        /*
        if (this.SelectedIndex > -1) {
          alert('o');
          // maindatas Update Work Schedule
          this.logger.log('Update Work Schedule :: ' + this.SelectedIndex, this.data);
          this.maindatas[this.SelectedIndex] = this.data;
          this.FilterTheArchive();
          this.ShowMessage('Work Schedules "' + this.data.name + '" is updated successfully.', '');
        } else {
          alert('n');
          // maindatas Add Work Schedule
          this.logger.log('Add Work Schedule  :: ', this.data);
          if (parseInt('0' + this.data.id, 0) > 0) {
            this.maindatas.push(this.data);
            this.logger.log('New Work Schedule Added Successfully :: ', this.maindatas);
            this.FilterTheArchive();
            this.ShowMessage('Work Schedules "' + this.data.name + '" is added successfully.', '');
          }
        }
        */
      });
    } catch (e) { }
  }
  LoadEmptyWorkDays(workDays) {
    for (let weekDay = 1; weekDay <= 7; weekDay++) {
      workDays.push(
        {
          dayOfWeek: weekDay,
          workTimes: [
            { startTime: '00:00', endTime: '00:00', title: '' },
            { startTime: '00:00', endTime: '00:00', title: '' }
          ],
          breakTimes: null
        }
      );
    }
  }

  LoadEmptyWorkDayof(dayOfWeek) {
    const workDay = new WorkDays();
    workDay.dayOfWeek = parseInt(dayOfWeek, 0);
    workDay.breakTimes = null;
    workDay.workTimes = [];
    workDay.workTimes.push({ startTime: '00:00', endTime: '00:00', title: '' });
    workDay.workTimes.push({ startTime: '00:00', endTime: '00:00', title: '' });
    // workDay.workTimes.push(this.LoadEmptyWorkTime());
    return workDay;
  }

  LoadEmptyWorkTime() {
    let workTime = new WorkTimes();
    workTime.startTime = '00:00';
    workTime.endTime = '00:00';
    workTime.title = '';
    return workTime;
  }


  onClickAdd() {
    this.SelectedIndex = -1;
    this.data = new DpsWorkSchedule();
    this.workSchedule = new WorkSchedule();
    this.data.id = 0;
    this.data.name = '';
    this.data.customerVatNumber = this.CustomerVatNumber;
    this.data.isArchived = false;
    this.data.isEnabled = true;
    this.workSchedule.workDays = [];
    this.LoadEmptyWorkDays(this.workSchedule.workDays);
    this.data.workSchedule = this.workSchedule;
    this.logger.log('EmptyData :: ', this.data);
    this.openDialog();
  }

  onClickEdit(i) {
    this.SelectedIndex = i;
    this.data = this.maindatas[i];
    // this.logger.log('Edit Data :: ', this.data);
    this.openDialog();
    return true;
  }

  onClickCopy(i) {
    this.SelectedIndex = -1;
    this.data = JSON.parse(JSON.stringify(this.maindatas[i]));
    this.data.id = 0;
    this.data.name += ' - Copy';
    this.data.isArchived = false;
    this.openDialog();
    return true;
  }

  updateWorkschedules() {
    this.workschedulesService.updateWorkschedule(this.data).subscribe(res => {
      this.logger.log('response :: ', res); this.logger.log('Data ::', this.data);
      this.maindatas[this.SelectedIndex] = this.data;
      this.FilterTheArchive();
    },
      (err: HttpErrorResponse) => {
        this.logger.log('Error :: ', err);
        if (err.error instanceof Error) {
          this.logger.log('Error occured=' + err.error.message);
        } else {
          this.logger.log('response code=' + err.status, 'response body=' + err.error);
        }
      }
    );
  }

  onClickDelete(i) {
    this.logger.log('Delete Clicked Index:: ' + i);
    this.data = this.maindatas[i];
    this.data.isArchived = true;
    this.updateWorkschedules();
    this.ShowMessage('Work Schedules "' + this.data.name + '" is deleted successfully.', '');
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    this.logger.log('Work Schedule index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updateWorkschedules();
    let EnabledStatus = '';
    if (event) { EnabledStatus = 'enabled'; } else { EnabledStatus = 'disabled'; }
    this.ShowMessage('Work Schedules "' + this.data.name + '" is ' + EnabledStatus + ' successfully.', '');
  }
}
