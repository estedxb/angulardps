import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Address, Language, WorkSchedule, DpsUser, LoginToken } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';

@Component({
  selector: 'app-createworkschedule',
  templateUrl: './createworkschedule.component.html',
  styleUrls: ['./createworkschedule.component.css']
})
export class CreateworkscheduleComponent implements OnInit {
  public languageString;
  public languageShortName;
  // public loginuserdetails: DpsUser = JSON.parse(this.setDummyDpsUserData());
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  @Input('parentData') public WorkScheduleId;

  @Input() public WorkScheduleFormData;
  WorkScheduleData: any;
  WorkScheduleForm: FormGroup;
  location: WorkSchedule;
  address: Address;
  language: Language;

  constructor(private formBuilder: FormBuilder, private workschedulesService: WorkschedulesService) { }

  ngOnInit() {
    console.log('Current WorkScheduleID : ' + this.WorkScheduleId);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.WorkScheduleForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      street: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]),
      number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      bus: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      place: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      postcode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-z0-9]+$')]),
      country: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])
    });
    this.createObjects();  // check validations
    this.loadWorkScheduleToEdit(this.VatNumber);
  }

  loadWorkScheduleToEdit(vatNumber: string) {
    this.workschedulesService.getWorkscheduleByVatNumber(vatNumber).subscribe(response => {
      response.forEach((element) => {

      });
    });
  }

  receiveMessageLanguage($event) {
    this.languageString = $event.name;
    this.languageShortName = $event.shortName;
    this.createObjects();
  }

  createObjects() {
    this.setJSONObject();
  }

  setJSONObject() {
    this.WorkScheduleData = {
      id: this.WorkScheduleId,
      customerVatNumber: this.VatNumber,
      name: this.WorkScheduleData.name,
      address: this.WorkScheduleData.address,
      isEnabled: this.WorkScheduleData.isEnabled,
      isArchived: this.WorkScheduleData.isArchived,
    };
  }

  public updateData() {
    this.createObjects();
  }

  public getJSONObject() {
    if (this.WorkScheduleData !== undefined && this.WorkScheduleData !== null) {
      return this.WorkScheduleData;
    }
  }

  onSaveWorkScheduleClick() {

    this.updateData();

    console.log('WorkScheduleData=' + this.WorkScheduleData);
    console.log(this.WorkScheduleData);

    if (this.WorkScheduleData !== undefined && this.WorkScheduleData !== null) {
      // check if WorkScheduleId has value
      // if WorkScheduleId has value ==> Update WorkSchedule
      // if WorkScheduleId is null ==> Create WorkSchedule
      if (this.WorkScheduleId !== undefined && this.WorkScheduleId !== null) {
        // Update WorkSchedule
        this.workschedulesService.updateWorkschedule(this.WorkScheduleData).subscribe(res => {
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
      } else {
        // Create WorkSchedule
        this.workschedulesService.createWorkschedule(this.WorkScheduleData).subscribe(res => {
          console.log('response=' + res);
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
  }
}
