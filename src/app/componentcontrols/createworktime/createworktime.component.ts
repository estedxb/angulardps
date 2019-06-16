import { Component, OnInit, Inject } from '@angular/core';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WorkTimes, DpsWorkSchedule } from '../../shared/models';
import { LoggingService } from '../../shared/logging.service';
// such override allows to keep some initial values

export function getTimepickerConfig(): TimepickerConfig {
  return Object.assign(new TimepickerConfig(), {
    hourStep: 1,
    minuteStep: 10,
    showMeridian: false,
    readonlyInput: false,
    mousewheel: true,
    showMinutes: true,
    showSeconds: false
  });
}

@Component({
  selector: 'app-createworktime',
  templateUrl: './createworktime.component.html',
  styleUrls: ['./createworktime.component.css'],
  providers: [{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class CreateWorkTimeComponent implements OnInit {
  public currentWorktime: WorkTimes;
  startTime: string;
  endTime: string;

  WorkTimeForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CreateWorkTimeComponent>,
    private logger: LoggingService, @Inject(MAT_DIALOG_DATA) public worktimedata: WorkTimes) {

    this.currentWorktime = worktimedata;
  }

  ngOnInit() {
    this.logger.log('Current WorkTime :: ', this.currentWorktime);

    this.WorkTimeForm = new FormGroup({
      // this.startTime: new FormControl('', [Validators.required]),
      // endTime: new FormControl('', [Validators.required]),

    });

    this.loadWorkTimeToEdit();
  }

  loadWorkTimeToEdit() {
    this.logger.log('loadWorkTimeToEdit:: ');
    this.startTime = '2019-08-10 ' + this.currentWorktime.startTime;
    this.endTime = '2019-08-10 ' + this.currentWorktime.endTime;
    this.logger.log('this.startTime :: ' + this.startTime);
    this.logger.log('this.endTime :: ' + this.endTime);
    this.createObjects();
  }

  updateData() { this.createObjects(); }

  createObjects() {
    //this.currentWorktime.startTime = this.startTime;
    //this.currentWorktime.endTime = this.endTime;
  }

}
