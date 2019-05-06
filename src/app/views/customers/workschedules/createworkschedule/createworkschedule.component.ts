import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { Address, LoginToken, DpsUser, DpsWorkSchedule, WorkSchedule, WorkDays, WorkTimes, WorkScheduleRow, WeekDayOf, BreakTimes } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CreateWorkTimeComponent } from '../../../../componentcontrols/createworktime/createworktime.component';

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
    // console.log('Current VatNumber : ' + this.VatNumber);
    console.log('ngOnInit currentDpsWorkSchedule :: ', this.currentDpsWorkSchedule.workSchedule);
    this.WorkScheduleForm = new FormGroup({ name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]) });
    this.loadWorkScheduleToEdit();
    // this.getDummyRows();
    // console.log('getDummyRows Data :: ', this.workScheduleRows);
  }


  loadWorkScheduleToEdit() {
    // console.log('currentDpsWorkSchedule :: ', this.currentDpsWorkSchedule);
    if (this.currentDpsWorkSchedule.id !== undefined || this.currentDpsWorkSchedule.id !== 0) {
      this.WorkScheduleForm.controls.name.setValue(this.currentDpsWorkSchedule.name + '');
      this.TransposeCurrentDpsWorkScheduleToWorkScheduleRows();
    } else {
      this.currentDpsWorkSchedule.id = 0;
    }
  }

  TransposeCurrentDpsWorkScheduleToWorkScheduleRows() {
    try {
      const missingWeekDays = '';
      const maxArrayLength = this.getRowMaxLength(this.currentDpsWorkSchedule.workSchedule);
      if (this.currentDpsWorkSchedule.workSchedule.workDays.length <= 7) {
        for (let w = 1; w <= 7; w++) {
          console.log('workDays[' + w + '] :: ' + ' dayOfWeek: ' +
            this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].dayOfWeek.toString());
          let isMissing = false;
          try {
            // console.log('dayOfWeek: ' + this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].dayOfWeek.toString());
            if (w !== this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].dayOfWeek) {
              isMissing = true;
            } else {
              isMissing = false;
              // tslint:disable-next-line: prefer-for-of
              for (let k = 0; k < this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes.length; k++) {
                try {
                  if (this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k]
                    .startTime.toString().indexOf('PM') >= 0) {
                    const StartTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k]
                      .startTime.toString().replace('PM', '').replace(' ', '').split(':');
                    this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].startTime
                      = (parseInt(StartTimes[0], 0) + 12).toString() + ':' + StartTimes[1];
                  } else if (this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k]
                    .startTime.toString().indexOf('AM') >= 0) {
                    const StartTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k]
                      .startTime.toString().replace('PM', '').replace(' ', '').split(':');
                    this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].startTime = StartTimes[0] + ':' + StartTimes[1];
                  }

                  if (this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].endTime.toString().indexOf('PM') >= 0) {
                    const EndTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k]
                      .endTime.toString().replace('PM', '').replace(' ', '').split(':');
                    this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].endTime
                      = (parseInt(EndTimes[0], 0) + 12).toString() + ':' + EndTimes[1];
                  } else if (this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k]
                    .endTime.toString().indexOf('AM') >= 0) {
                    const EndTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k]
                      .endTime.toString().replace('PM', '').replace(' ', '').split(':');
                    this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].endTime
                      = EndTimes[0] + ':' + EndTimes[1];
                  }

                } catch (e) {
                  this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].startTime = '00:00';
                  this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].endTime = '00:00';
                }

                console.log('StartTime & EndTime AM/PM Found After',
                  this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].startTime,
                  this.currentDpsWorkSchedule.workSchedule.workDays[w - 1].workTimes[k].endTime
                );
              }
            }
          } catch (e) { console.log('Error ! ' + e.message); isMissing = true; }

          if (isMissing) {
            console.log('Missing :: ' + w);
            const wt = [];
            for (let x = 1; x <= maxArrayLength; x++) { wt.push({ startTime: '00:00', endTime: '00:00', title: '' }); }
            this.currentDpsWorkSchedule.workSchedule.workDays.splice(w, 0, { dayOfWeek: w, workTimes: wt, breakTimes: null });
            w = w - 1;
          }
        }
      }

      console.log('After TransposeCurrentDpsWorkScheduleToWorkScheduleRows :: ', this.currentDpsWorkSchedule);

      for (let i = 0; maxArrayLength > i; i++) {
        console.log(' TransposeCurrentDpsWorkScheduleToWorkScheduleRows  i :: ' + i);
        this.workScheduleRows.push(this.loadDataOfRow(i));
      }


    } catch (e) {
      alert(e.message);
    }
  }

  LoadEmptyWorkDayOf(workDays, weekDay, maxArrayLength) {
    const wt = [];
    for (let x = 1; x <= maxArrayLength; x++) { wt.push({ startTime: '00:00', endTime: '00:00', title: '' }); }
    workDays.splice(weekDay, 0, { dayOfWeek: weekDay, workTimes: wt, breakTimes: null });
  }

  getWorkTimeOf() {
    const workTimes: WorkTimes = new WorkTimes();
    workTimes.startTime = '00:00'; // '0' + rowid + ':0' + dayOfWeek;
    workTimes.endTime = '00:00'; // '0' + rowid + ':0' + dayOfWeek;
    workTimes.title = ''; // 'Data for Row (' + rowid + ') of weekday(' + dayOfWeek + ')';
    return workTimes;
  }

  loadDataOfRow(rowid) {
    const workScheduleRow = new WorkScheduleRow();
    workScheduleRow.rowid = rowid;
    const weekDayOf: WeekDayOf[] = [];
    for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
      const loadWorkDays: WorkDays[] = this.currentDpsWorkSchedule.workSchedule.workDays;
      let loadWorkTimes: WorkTimes;

      console.log('dayOfWeekof : ' + dayOfWeek);
      for (let x = 0; x < loadWorkDays.length; x++) {
        console.log('loadWorkDays : ' + x);
        if (dayOfWeek === loadWorkDays[x].dayOfWeek) {
          loadWorkTimes = loadWorkDays[x].workTimes[1];
        }
      }

      if (loadWorkTimes === null) {
        console.log('loadWorkTimes is null');
        loadWorkTimes = new WorkTimes();
        loadWorkTimes.title = '';
        loadWorkTimes.startTime = '';
        loadWorkTimes.endTime = '';
      }
      weekDayOf.push(this.loadWeekDayOf(dayOfWeek, loadWorkTimes));
    }
    workScheduleRow.weekDayOf = weekDayOf;
    return workScheduleRow;
  }

  loadWeekDayOf(dayOfWeek: number, workTimes: WorkTimes) {
    const weekDayOf = new WeekDayOf();
    weekDayOf.dayOfWeek = dayOfWeek;
    weekDayOf.workTimes = workTimes;
    // weekDayOf.workTimes.startTime = workTimes.startTime + ''; // '0' + rowid + ':0' + dayOfWeek;
    // weekDayOf.workTimes.endTime = workTimes.endTime + ''; // '0' + rowid + ':0' + dayOfWeek;
    // weekDayOf.workTimes.title = workTimes.title + ''; // 'Data for Row (' + rowid + ') of weekday(' + dayOfWeek + ')';
    return weekDayOf;
  }

  getRowMaxLength(workSchedule: WorkSchedule) {
    let maxArrayLength = 0; let ArrayLength = 0; const workDays: WorkDays[] = workSchedule.workDays;
    for (let i = 0; workDays.length > i; i++) {
      const workTimes: WorkTimes[] = workDays[i].workTimes; ArrayLength = workTimes.length;
      if (ArrayLength > maxArrayLength) { maxArrayLength = ArrayLength; }
    }
    return maxArrayLength;
  }

  addEmptyRow() {
    let lastRowId = 0;
    // console.log('this.workScheduleRows.length :: ', this.workScheduleRows.length);
    if (this.workScheduleRows.length > 0) {
      const lastRow: WorkScheduleRow = this.workScheduleRows[this.workScheduleRows.length - 1];
      console.log('lastRow :: ', lastRow);
      lastRowId = lastRow.rowid;
    }
    console.log('lastRow Row ID :: ', lastRowId);
    this.workScheduleRows.push(this.getDummyRowOf(lastRowId + 1));
  }

  getDummyRows() {
    this.workScheduleRows.push(this.getDummyRowOf(1));
    this.workScheduleRows.push(this.getDummyRowOf(2));
  }

  getDummyRowOf(rowid) {
    const workScheduleRow = new WorkScheduleRow();
    workScheduleRow.rowid = rowid;
    const weekDayOf: WeekDayOf[] = [];
    for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) { weekDayOf.push(this.getWeekDayOf(dayOfWeek, rowid)); }
    workScheduleRow.weekDayOf = weekDayOf;
    return workScheduleRow;
  }

  getWeekDayOf(dayOfWeek: number, rowid: number) {
    const weekDayOf = new WeekDayOf();
    weekDayOf.workTimes = new WorkTimes();
    weekDayOf.dayOfWeek = dayOfWeek;
    weekDayOf.workTimes.startTime = ''; // '0' + rowid + ':0' + dayOfWeek;
    weekDayOf.workTimes.endTime = ''; // '0' + rowid + ':0' + dayOfWeek;
    weekDayOf.workTimes.title = ''; // 'Data for Row (' + rowid + ') of weekday(' + dayOfWeek + ')';
    return weekDayOf;
  }

  removeRow(removeRowId: number) {
    console.log('Remove Row ID :: ' + removeRowId + ' :: this.workScheduleRows.length :: ' + this.workScheduleRows.length);
    for (let i = 0; i < this.workScheduleRows.length; i++) {
      console.log('this.workScheduleRows[i] :: ', this.workScheduleRows[i]);
      const currentRow: WorkScheduleRow = this.workScheduleRows[i];
      console.log('currentRow :: ', currentRow);
      console.log('currentRow Row ID :: ', currentRow.rowid);
      if (currentRow.rowid === removeRowId) {
        this.workScheduleRows.splice(i, 1);
      }
    }
    console.log('After Remove Index :: ', this.workScheduleRows);
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

      const dialogRef = this.dialog.open(CreateWorkTimeComponent, dialogConfig);

      // const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => { this.ShowMessage($event.MSG, $event.Action); });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
        console.log('this.SelectedRowID ::', this.SelectedRowID + '  :: this.SelectedWeekDay ::', this.SelectedWeekDay);
        // Need to update currentDpsWorkSchedule and workScheduleRows
        // this.maindatas[this.SelectedIndex] = this.data;
        this.ShowMessage('Work Time "' + this.data + '" is updated successfully.', '');
      });

    } catch (e) { }
  }

}
