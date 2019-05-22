import { Component, OnInit, Input, Output, EventEmitter, Inject, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { Address, LoginToken, DpsUser, DpsWorkSchedule, WorkSchedule, WorkDays, WorkTimes, WorkScheduleRow, WeekDayOf, BreakTimes } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CreateWorkTimeComponent } from '../../../../componentcontrols/createworktime/createworktime.component';
import { copyObj } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-createworkschedule',
  templateUrl: './createworkschedule.component.html',
  styleUrls: ['./createworkschedule.component.css']
})
export class CreateWorkScheduleComponent implements OnInit {
  public selectedDpsWorkSchedule: DpsWorkSchedule;
  public currentDpsWorkSchedule: DpsWorkSchedule;
  public workScheduleRows = [];
  public SelectedRowID: number;
  public SelectedWeekDay: number;
  public data: WorkTimes;
  public isValidMon = true;
  public isValidTue = true;
  public isValidWed = true;
  public isValidThu = true;
  public isValidFri = true;
  public isValidSat = true;
  public isValidSun = true;
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
    this.selectedDpsWorkSchedule = dpsworkscheduledata;
    this.currentDpsWorkSchedule = JSON.parse(JSON.stringify(dpsworkscheduledata));
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

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.WorkScheduleForm = new FormGroup({ name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]) });
    this.loadWorkScheduleToEdit();
  }

  loadWorkScheduleToEdit() {
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
      this.AddMissingWeekDay(maxArrayLength);
      // console.log('After TransposeCurrentDpsWorkScheduleToWorkScheduleRows :: ', this.currentDpsWorkSchedule);
      for (let i = 0; maxArrayLength > i; i++) { this.workScheduleRows.push(this.loadDataOfRow(i)); }
      // console.log('this.workScheduleRows', this.workScheduleRows);
    } catch (e) {
      alert(e.message);
    }
  }

  AddMissingWeekDay(maxArrayLength) {
    if (this.currentDpsWorkSchedule.workSchedule.workDays.length <= 7) {
      for (let w = 0; w < 7; w++) {
        let isMissing = false;
        const thisweekday = w + 1;
        try {
          if (this.currentDpsWorkSchedule.workSchedule.workDays[w] !== undefined
            && this.currentDpsWorkSchedule.workSchedule.workDays[w] !== null) {

            if (this.currentDpsWorkSchedule.workSchedule.workDays[w].dayOfWeek === thisweekday) {
              isMissing = false;
              this.ResetAMPM(w);
            } else {
              isMissing = true;
            }
          } else {
            isMissing = true;
          }
        } catch (e) {
          console.error('Error ! ' + e.message);
          isMissing = true;
        }

        if (isMissing) {
          // console.log('Missed WeekDay ' + thisweekday);
          const wt = [];
          for (let x = 1; x <= maxArrayLength; x++) { wt.push({ startTime: '00:00', endTime: '00:00', title: '' }); }
          this.currentDpsWorkSchedule.workSchedule.workDays.splice(w, 0, { dayOfWeek: thisweekday, workTimes: wt, breakTimes: null });
          w = w - 1;
        }
      }
    }
  }

  ResetAMPM(w) {
    // tslint:disable-next-line: prefer-for-of
    for (let k = 0; k < this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes.length; k++) {
      try {
        if (this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k]
          .startTime.toString().indexOf('PM') >= 0) {
          const StartTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k]
            .startTime.toString().replace('PM', '').replace(' ', '').split(':');
          this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k].startTime
            = (parseInt(StartTimes[0], 0) + 12).toString() + ':' + StartTimes[1];
        } else if (this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k]
          .startTime.toString().indexOf('AM') >= 0) {
          const StartTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k]
            .startTime.toString().replace('PM', '').replace(' ', '').split(':');
          this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k].startTime = StartTimes[0] + ':' + StartTimes[1];
        }

        if (this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k].endTime.toString().indexOf('PM') >= 0) {
          const EndTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k]
            .endTime.toString().replace('PM', '').replace(' ', '').split(':');
          this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k].endTime
            = (parseInt(EndTimes[0], 0) + 12).toString() + ':' + EndTimes[1];
        } else if (this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k]
          .endTime.toString().indexOf('AM') >= 0) {
          const EndTimes = this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k]
            .endTime.toString().replace('PM', '').replace(' ', '').split(':');
          this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k].endTime
            = EndTimes[0] + ':' + EndTimes[1];
        }

      } catch (e) {
        this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k].startTime = '00:00';
        this.currentDpsWorkSchedule.workSchedule.workDays[w].workTimes[k].endTime = '00:00';
      }
    }
  }

  LoadEmptyWorkDayOf(workDays, weekDay, maxArrayLength) {
    const wt = [];
    for (let x = 1; x <= maxArrayLength; x++) { wt.push({ startTime: '00:00', endTime: '00:00', title: '' }); }
    workDays.splice(weekDay, 0, { dayOfWeek: weekDay, workTimes: wt, breakTimes: null });
  }

  loadDataOfRow(rowid) {
    console.log('loadDataOfRow rowid :: ' + rowid);
    try {
      const workScheduleRow = new WorkScheduleRow();
      workScheduleRow.rowid = rowid;
      const weekDayOf: WeekDayOf[] = [];
      for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
        console.log('loadDataOfRow for dayOfWeek :: ' + dayOfWeek);
        const loadWorkDays: WorkDays[] = this.currentDpsWorkSchedule.workSchedule.workDays;
        let loadWorkTimes: WorkTimes;

        console.log('loadDataOfRow for loadWorkDays.length :: ' + loadWorkDays.length);
        // tslint:disable-next-line: prefer-for-of
        for (let x = 0; x < loadWorkDays.length; x++) {
          console.log('loadDataOfRow for loadWorkDays :: ' + x);
          if (dayOfWeek === loadWorkDays[x].dayOfWeek) {
            console.log('loadDataOfRow for dayOfWeek === loadWorkDays[x].dayOfWeek :: ' + (dayOfWeek === loadWorkDays[x].dayOfWeek));
            console.log('loadDataOfRow loadWorkDays[x].workTimes[1] is', loadWorkDays[x].workTimes[1]);
            loadWorkTimes = loadWorkDays[x].workTimes[rowid];
          }
        }

        if (loadWorkTimes === null) {
          console.log('loadWorkTimes is null');
          loadWorkTimes = new WorkTimes();
          loadWorkTimes.title = '';
          loadWorkTimes.startTime = '';
          loadWorkTimes.endTime = '';
        }
        console.log('loadWorkTimes :: ', loadWorkTimes);
        weekDayOf.push(this.loadWeekDayOf(dayOfWeek, loadWorkTimes));
      }
      console.log('loadDataOfRow weekDayOf', weekDayOf);
      workScheduleRow.weekDayOf = weekDayOf;
      console.log('loadDataOfRow workScheduleRow rowid :: ' + rowid, workScheduleRow);
      return workScheduleRow;
    } catch (e) {
      alert(e.message);
    }
  }

  loadWeekDayOf(dayOfWeek: number, workTimes: WorkTimes) {
    const weekDayOf = new WeekDayOf();
    weekDayOf.dayOfWeek = dayOfWeek;
    weekDayOf.workTimes = workTimes;
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
    this.workScheduleRows.push(this.getEmptyRowOf(lastRowId + 1));
    this.addEmptyWorkTimeToCurrentDpsWorkSchedule();
    console.log('this.currentDpsWorkSchedule after addEmptyRow:: ', this.currentDpsWorkSchedule);
  }

  addEmptyWorkTimeToCurrentDpsWorkSchedule() {
    this.currentDpsWorkSchedule.workSchedule.workDays.forEach(function (wday) {
      wday.workTimes.push({ startTime: '00:00', endTime: '00:00', title: '' });
    });
  }

  removeWorkTimeFromCurrentDpsWorkSchedule(rowid) {
    this.currentDpsWorkSchedule.workSchedule.workDays.forEach(function (wday) {
      let i = 0;
      let breaked = false;
      wday.workTimes.forEach(function (wTimes) {
        i += 1;
        if (rowid === i && !breaked) {
          console.log('removeWorkTimeFromCurrentDpsWorkSchedule :: ', wTimes);
          wday.workTimes.splice(rowid, 1);
          breaked = true;
        }
      });
    });
  }

  getEmptyRowOf(rowid) {
    console.log('getEmptyRowOf :: ' + rowid);
    const workScheduleRow = new WorkScheduleRow();
    workScheduleRow.rowid = rowid;
    const weekDayOf: WeekDayOf[] = [];
    for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) { weekDayOf.push(this.getEmptyWeekDayOf(dayOfWeek, rowid)); }
    workScheduleRow.weekDayOf = weekDayOf;
    return workScheduleRow;
  }

  getEmptyWeekDayOf(dayOfWeek: number, rowid: number) {
    const weekDayOf = new WeekDayOf();
    weekDayOf.workTimes = new WorkTimes();
    weekDayOf.dayOfWeek = dayOfWeek;
    weekDayOf.workTimes.startTime = ''; // '0' + rowid + ':0' + dayOfWeek;
    weekDayOf.workTimes.endTime = ''; // '0' + rowid + ':0' + dayOfWeek;
    weekDayOf.workTimes.title = ''; // 'Data for Row (' + rowid + ') of weekday(' + dayOfWeek + ')';
    return weekDayOf;
  }

  removeRow(removeRowId: number) {

    // console.log('Remove Row ID :: ' + removeRowId + ' :: this.workScheduleRows.length :: ' + this.workScheduleRows.length);
    for (let i = 0; i < this.workScheduleRows.length; i++) {
      // console.log('this.workScheduleRows[i] :: ', this.workScheduleRows[i]);
      const currentRow: WorkScheduleRow = this.workScheduleRows[i];
      // console.log('currentRow :: ', currentRow);
      // console.log('currentRow Row ID :: ', currentRow.rowid);
      if (currentRow.rowid === removeRowId) {
        this.workScheduleRows.splice(i, 1);
      }
    }
    // console.log('After Remove Index :: ', this.workScheduleRows);
    this.removeWorkTimeFromCurrentDpsWorkSchedule(removeRowId);
    // console.log('this.currentDpsWorkSchedule after removeRow:: ', this.currentDpsWorkSchedule);
  }

  ShowMessage(msg, action) { this.showmsg.emit({ MSG: msg, Action: action }); }

  updateData() { this.createObjects(); }

  createObjects() { this.currentDpsWorkSchedule.name = this.WorkScheduleForm.get('name').value; }

  public getJSONObject() {
    if (this.currentDpsWorkSchedule !== undefined && this.currentDpsWorkSchedule !== null) { return this.currentDpsWorkSchedule; }
  }

  OnTextBoxBlur(InputValue, rowid, dayOfWeek, SE, HM) {
    // console.log('OnTextBoxBlur(' + InputValue + ', ' + rowid + ', ' + dayOfWeek + ', ' + SE + ', ' + HM + '); ');
    this.currentDpsWorkSchedule.workSchedule.workDays.forEach(wday => {
      if (dayOfWeek === wday.dayOfWeek) {
        // console.log('wday(' + (rowid + 1) + ')', wday);
        let i = 0;
        let breaked = false;
        wday.workTimes.forEach(wTimes => {
          i += 1;
          // console.log('wTimes (' + i + ')', wTimes);
          // console.log('i - ' + i + ' :: rowid+1 - ' + rowid + 1, wTimes);
          if (rowid + 1 === i && !breaked) {
            // console.log('OnTextBoxBlur wTimes :: ', wTimes);
            if (SE === 'E') { // EndTime
              // console.log('updateWorkScheduleWorkTime EndTime');
              if (HM === 'M') { // EndTime Min
                // console.log('updateWorkScheduleWorkTime EndTime Min');
                wTimes.endTime = wTimes.endTime.split(':')[0] + ':' + InputValue;
              } else {// EndTime Hour
                // console.log('updateWorkScheduleWorkTime EndTime Hour');
                wTimes.endTime = InputValue + ':' + wTimes.endTime.split(':')[1];
              }
            } else {// StartTime
              // console.log('updateWorkScheduleWorkTime StartTime');
              if (HM === 'M') { // StartTime Min
                // console.log('updateWorkScheduleWorkTime StartTime Min');
                wTimes.startTime = wTimes.startTime.split(':')[0] + ':' + InputValue;
              } else {// StartTime Hour
                // console.log('updateWorkScheduleWorkTime StartTime Hour');
                wTimes.startTime = InputValue + ':' + wTimes.startTime.split(':')[1];
              }
            }
            breaked = true;
            this.updateVaild(wday.workTimes, wTimes, dayOfWeek, rowid);
          }
        });
      }
    });
    console.log('OnTextBoxBlur currentDpsWorkSchedule :: ', this.currentDpsWorkSchedule.workSchedule);
  }

  updateVaild(wday_workTimes, wTimes, dayOfWeek, rowid) {
    let isValid = true;
    const STSplit = wTimes.startTime.split(':');
    const ETSplit = wTimes.endTime.split(':');
    const sTime = new Date(2019, 5, 1, parseInt(STSplit[0], 0), parseInt(STSplit[1], 0), 0);
    const eTime = new Date(2019, 5, 1, parseInt(ETSplit[0], 0), parseInt(ETSplit[1], 0), 0);
    if (sTime > eTime) {
      isValid = false;
    } else {
      let i = 0;
      let breaked = false;
      wday_workTimes.forEach(wwTimes => {
        i += 1;
        if (rowid + 1 !== i) {
          const CSTSplit = wwTimes.startTime.split(':');
          const CETSplit = wwTimes.endTime.split(':');
          const csTime = new Date(2019, 5, 1, parseInt(CSTSplit[0], 0), parseInt(CSTSplit[1], 0), 0);
          const ceTime = new Date(2019, 5, 1, parseInt(CETSplit[0], 0), parseInt(CETSplit[1], 0), 0);
          if ((sTime > csTime) && (sTime < ceTime)) {
            isValid = false;
          } else {
            if ((eTime > csTime) && (eTime < ceTime)) {
              isValid = false;
            }
          }
        }
      });
    }

    if (dayOfWeek === 1) {
      this.isValidMon = isValid;
    } else if (dayOfWeek === 2) {
      this.isValidTue = isValid;
    } else if (dayOfWeek === 3) {
      this.isValidWed = isValid;
    } else if (dayOfWeek === 4) {
      this.isValidThu = isValid;
    } else if (dayOfWeek === 5) {
      this.isValidFri = isValid;
    } else if (dayOfWeek === 6) {
      this.isValidSat = isValid;
    } else {
      this.isValidSun = isValid;
    }
  }

  onKey(e) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
      return true;
    } else {
      return false;
    }
  }
  onHourKey(e) {
    console.log(e.target.value);
    if (e.target.value < 23) {
      return true;
    } else {
      let s = (e.target.value % 24).toString();
      if (s.length < 2) { s = '0' + s; };
      e.target.value = s;
      return false;
    }
  }

  onMinKey(e) {
    console.log(e.target.value);
    if (e.target.value < 59) {
      return true;
    } else {
      let s = (e.target.value % 60).toString();
      if (s.length < 2) { s = '0' + s; };
      e.target.value = s;
      return false;
    }
  }

  onSaveWorkScheduleClick() {
    this.createObjects();
    console.log('data ::', this.currentDpsWorkSchedule);
    if (this.WorkScheduleForm.valid && this.isValidMon && this.isValidTue && this.isValidWed && this.isValidThu && this.isValidFri && this.isValidSat && this.isValidSun) {
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
}

/*
getDummyRows() {
console.log('getDummyRows :: ');
this.workScheduleRows.push(this.getDummyRowOf(1));
this.workScheduleRows.push(this.getDummyRowOf(2));
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


getWorkTimeOf() {
const workTimes: WorkTimes = new WorkTimes();
workTimes.startTime = '10:20'; // '0' + rowid + ':0' + dayOfWeek;
workTimes.endTime = '30:40'; // '0' + rowid + ':0' + dayOfWeek;
workTimes.title = ''; // 'Data for Row (' + rowid + ') of weekday(' + dayOfWeek + ')';
return workTimes;
}
*/
