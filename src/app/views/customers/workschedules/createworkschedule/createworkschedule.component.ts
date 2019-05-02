import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { Address, LoginToken, DpsUser, DpsWorkSchedule, WorkSchedule, WorkDays, WorkTimes, WorkScheduleRow, WeekDayOf } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-createworkschedule',
  templateUrl: './createworkschedule.component.html',
  styleUrls: ['./createworkschedule.component.css']
})
export class CreateWorkScheduleComponent implements OnInit {
  public currentDpsWorkSchedule: DpsWorkSchedule;
  public workScheduleRows = [];
  public SelectedRowID: number;
  public SelectedWeekDay: number;
  public data: WorkTimes;
  // public workScheduleRow: WorkScheduleRow;

  public oldCurrentWorkSchedule: any;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;

  WorkScheduleForm: FormGroup;

  @Output() showmsg = new EventEmitter<object>();

  constructor(
    private formBuilder: FormBuilder, private workschedulesService: WorkschedulesService, private dialog: MatDialog,
    private snackBar: MatSnackBar, public dialogRef: MatDialogRef<CreateWorkScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public dpsworkscheduledata: DpsWorkSchedule) {
    this.currentDpsWorkSchedule = dpsworkscheduledata;
  }


  /*
    ngDoCheck() {
      console.log('ngDoCheck CreateLocationComponent');
      console.log(this.currentDpsWorkSchedule);
      if (this.oldCurrentLocation !== this.currentDpsWorkSchedule) {
        this.oldCurrentLocation = this.currentDpsWorkSchedule;
        this.loadLocationToEdit();
      }
    }
  */

  ngOnInit() {
    console.log('Current VatNumber : ' + this.VatNumber);
    this.WorkScheduleForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])
    });
    this.loadWorkScheduleToEdit();
    // this.getDummyRows();
    // console.log('getDummyRows Data :: ', this.workScheduleRows);
  }

  getDummyRows() {
    this.workScheduleRows.push(this.getDummyRowOf(1));
    this.workScheduleRows.push(this.getDummyRowOf(2));
  }

  removeRow(removeRowId: number) {
    console.log('Remove Row ID :: ' + removeRowId + ' :: this.workScheduleRows.length :: ' + this.workScheduleRows.length);
    for (let i = 0; i < this.workScheduleRows.length; i++) {
      console.log('this.workScheduleRows[i] :: ', this.workScheduleRows[i]);
      let currentRow: WorkScheduleRow = this.workScheduleRows[i];
      console.log('currentRow :: ', currentRow);
      console.log('currentRow Row ID :: ', currentRow.rowid);
      if (currentRow.rowid === removeRowId) {
        this.workScheduleRows.splice(i, 1);
      }
    }
    console.log('After Remove Index :: ', this.workScheduleRows);
  }

  addEmptyRow() {
    let lastRowId: number = 0;
    console.log('this.workScheduleRows.length :: ', this.workScheduleRows.length);
    if (this.workScheduleRows.length > 0) {
      const lastRow: WorkScheduleRow = this.workScheduleRows[this.workScheduleRows.length - 1];
      console.log('lastRow :: ', lastRow);
      lastRowId = lastRow.rowid;
    }
    console.log('lastRow Row ID :: ', lastRowId);
    this.workScheduleRows.push(this.getDummyRowOf(lastRowId + 1));
  }

  getDummyRowOf(rowid) {
    const workScheduleRow = new WorkScheduleRow();
    workScheduleRow.rowid = rowid;
    const weekDayOf: WeekDayOf[] = [];
    for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) { weekDayOf.push(this.getweekDayOf(dayOfWeek, rowid)); }
    workScheduleRow.weekDayOf = weekDayOf;
    return workScheduleRow;
  }

  getweekDayOf(dayOfWeek, rowid) {
    const weekDayOf = new WeekDayOf();
    weekDayOf.dayOfWeek = dayOfWeek;
    weekDayOf.workTimes = new WorkTimes();
    weekDayOf.workTimes.startTime = '0' + rowid + ':0' + dayOfWeek;
    weekDayOf.workTimes.endTime = '0' + rowid + ':0' + dayOfWeek;
    weekDayOf.workTimes.title = 'Data for Row (' + rowid + ') of weekday(' + dayOfWeek + ')';
    return weekDayOf;
  }

  loadWorkScheduleToEdit() {
    console.log('currentDpsWorkSchedule :: ', this.currentDpsWorkSchedule);
    if (this.currentDpsWorkSchedule.id !== undefined || this.currentDpsWorkSchedule.id !== 0) {
      this.WorkScheduleForm.controls.name.setValue(this.currentDpsWorkSchedule.name + '');
      this.TransposeCurrentDpsWorkScheduleToWorkScheduleRows();
    } else {
      this.currentDpsWorkSchedule.id = 0;
    }
  }

  TransposeCurrentDpsWorkScheduleToWorkScheduleRows() {
    for (let w = 0; w <= this.currentDpsWorkSchedule.workSchedule.workDays.length; w++) {
      const wd: WorkDays = this.currentDpsWorkSchedule.workSchedule.workDays[w];
      console.log('wd :: ', wd);
      // const maxArrayLength = this.currentDpsWorkSchedule.workSchedule.reduce((acc, curr, index) =>
      //   curr.length > acc.length ? index : index - 1
      // );
      // console.log('maxArrayLength :: ' + maxArrayLength);
    }
  }

  ShowMessage(msg, action) { this.showmsg.emit({ MSG: msg, Action: action }); }

  updateData() { this.createObjects(); }

  createObjects() { this.currentDpsWorkSchedule.name = this.WorkScheduleForm.get('name').value; }

  public getJSONObject() {
    if (this.currentDpsWorkSchedule !== undefined && this.currentDpsWorkSchedule !== null) { return this.currentDpsWorkSchedule; }
  }

  onSaveLocationClick() {
    this.createObjects();
    console.log('data ::', this.currentDpsWorkSchedule);
    if (this.WorkScheduleForm.valid) {
      if (this.currentDpsWorkSchedule !== undefined && this.currentDpsWorkSchedule !== null) {
        if (
          this.currentDpsWorkSchedule.id !== 0 && this.currentDpsWorkSchedule.id !== undefined &&
          this.currentDpsWorkSchedule.id !== null) {
          console.log('Update Work Schedule');
          // Update Work Schedule
          this.workschedulesService.updateWorkschedule(this.currentDpsWorkSchedule).subscribe(res => {
            console.log('Update Work Schedule Response :: ', res);
            this.dialogRef.close(this.currentDpsWorkSchedule);
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
          console.log('Create Work Schedule');
          this.workschedulesService.createWorkschedule(this.currentDpsWorkSchedule).subscribe(res => {
            console.log('Work Schedule Response :: ', res.body);
            this.currentDpsWorkSchedule.id = res.body;
            this.dialogRef.close(this.currentDpsWorkSchedule);
          },
            (err: HttpErrorResponse) => {
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
    } else {
      console.log('Form is Not Vaild');
    }
  }

  onWorkTimeSelector(RowId, WeekDay, workTimes: WorkTimes) {
    console.log('onWorkTimeSelector (RowId =  ' + RowId + ' :: WeekDay = ' + WeekDay + ' :: workTimes = [OBject Follows])', workTimes);
    this.SelectedRowID = RowId;
    this.SelectedWeekDay = WeekDay;
    this.data = new WorkTimes();
    this.data.title = workTimes.title;
    this.data.startTime = workTimes.startTime;
    this.data.endTime = workTimes.endTime;
    console.log('onClickAdd EmptyData', this.data);
    this.openDialog();
  }

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '500px';
      dialogConfig.data = this.data;
      dialogConfig.ariaLabel = 'Arial Label Work Schedule Dialog';
      /*
            const dialogRef = this.dialog.open(CreateworkscheduleComponent, dialogConfig);
      
            const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => { this.ShowMessage($event.MSG, $event.Action); });
      
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              this.data = result;
              console.log('this.data ::', this.data);
              console.log('this.SelectedIndex ::', this.SelectedIndex);
              if (this.SelectedIndex >= -1) {
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
            */
    } catch (e) { }
  }

}
