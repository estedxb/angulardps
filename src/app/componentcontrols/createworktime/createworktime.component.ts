import { Component, OnInit, Inject } from '@angular/core';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WorkTimes, DpsWorkSchedule } from '../../shared/models';
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

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CreateWorkTimeComponent>, @Inject(MAT_DIALOG_DATA) public worktimedata: WorkTimes) { 
    
    this.currentWorktime = worktimedata;
  }

  ngOnInit() {
    console.log('Current WorkTime :: ', this.currentWorktime);
   
    this.WorkTimeForm = new FormGroup({
      // this.startTime: new FormControl('', [Validators.required]),
      // endTime: new FormControl('', [Validators.required]),
      
   });

    this.loadWorkTimeToEdit();
  }

  loadWorkTimeToEdit() {   
    console.log('loadWorkTimeToEdit:: ');    
      this.startTime =  '2019-08-10 ' + this.currentWorktime.startTime;
      this.endTime = '2019-08-10 ' + this.currentWorktime.endTime;      
      console.log('this.startTime :: ' + this.startTime);
      console.log('this.endTime :: ' + this.endTime);
      this.createObjects();
  }

  updateData() { this.createObjects(); }

  createObjects() {
    //this.currentWorktime.startTime = this.startTime;
    //this.currentWorktime.endTime = this.endTime;

  }

}
