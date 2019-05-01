import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Address, LoginToken, DpsUser, DpsWorkSchedule, WorkSchedule } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-createworkschedule',
  templateUrl: './createworkschedule.component.html',
  styleUrls: ['./createworkschedule.component.css']
})
export class CreateworkscheduleComponent implements OnInit {
  public currentDpsWorkSchedule: DpsWorkSchedule;
  public oldCurrentWorkSchedule: any;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;

  WorkScheduleForm: FormGroup;
  workSchedule: WorkSchedule;

  @Output() showmsg = new EventEmitter<object>();

  constructor(
    private formBuilder: FormBuilder, private workschedulesService: WorkschedulesService,
    public dialogRef: MatDialogRef<CreateworkscheduleComponent>, @Inject(MAT_DIALOG_DATA) public dpsworkscheduledata: DpsWorkSchedule) {
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
  }

  loadWorkScheduleToEdit() {
    if (this.currentDpsWorkSchedule.id !== undefined || this.currentDpsWorkSchedule.id !== 0) {
      this.WorkScheduleForm.controls.name.setValue(this.currentDpsWorkSchedule.name + '');
    } else {
      this.currentDpsWorkSchedule.id = 0;
    }
  }

  ShowMessage(msg, action) {
    this.showmsg.emit({ MSG: msg, Action: action });
  }

  updateData() { this.createObjects(); }

  createObjects() {
    this.currentDpsWorkSchedule.name = this.WorkScheduleForm.get('name').value;
  }

  public getJSONObject() {
    if (this.currentDpsWorkSchedule !== undefined && this.currentDpsWorkSchedule !== null) {
      return this.currentDpsWorkSchedule;
    }
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
}
