import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User, DpsUser, LoginToken, DpsPostion } from '../../../../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
@Component({
  selector: 'app-createposition',
  templateUrl: './createposition.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatepositionComponent implements OnInit {
  PositionForm: FormGroup;
  PositionData: any;
  dpsPosition: DpsPostion;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  @Input('parentData') public PositionId;

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {

    this.PositionForm = new FormGroup({
      jobdescription: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      taskdescription: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      costcenter: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]+$')]),
      file: new FormControl('', [Validators.required])


    });
    this.loadPositionsToEdit(this.VatNumber);
    this.createObjects();  // check validations 
  }

  loadPositionsToEdit(VatNumber: string) {
    this.positionsService.getPositionsByVatNumber(VatNumber).subscribe(response => {
      response.forEach((element) => {
        let object = element.position;
        if (element.id === this.PositionId) {
          this.PositionForm.controls['jobdescription'].setValue(object.name);
          this.PositionForm.controls['taskdescription'].setValue(object.taskDescription);
          this.PositionForm.controls['costcenter'].setValue(object.costCenter);
        }
      })
    });
  }

  createObjects() {
    this.dpsPosition = new DpsPostion();
    // dpsPosition object
    this.dpsPosition.customerVatNumber = this.VatNumber;
    this.dpsPosition.id = this.PositionId;
    this.dpsPosition.isArchived = false;
    this.dpsPosition.isEnabled = true;
    this.dpsPosition.position.costCenter = this.PositionForm.get('costcenter').value;
    this.dpsPosition.position.taskDescription = this.PositionForm.get('taskdescription').value;
    this.dpsPosition.position.name = this.PositionForm.get('jobdescription').value;
    this.dpsPosition.position.workstationDocument = this.PositionForm.get('file').value;
    //this.dpsPosition.position.isStudentAllowed =  this.PositionForm.get('file').value;
    this.setJSONObject();
  }



  setJSONObject() {
    this.PositionData = {
      id: this.dpsPosition.id,
      customerVatNumber: this.dpsPosition.customerVatNumber,
      position: this.dpsPosition.position,
      isEnabled: this.dpsPosition.isEnabled,
      isArchived: this.dpsPosition.isArchived
    };
  }

  public updateData() {
    this.createObjects();
  }

  onSaveUserClick() {

    this.updateData();

    console.log('PositionData=' + this.PositionData);
    console.log(this.PositionData);

    if (this.PositionData !== undefined && this.PositionData !== null) {
      console.log(this.PositionData);
      // check if username has value
      // if username has value ==> Update User
      // if username is null ==> Create User
      if (this.PositionId !== undefined && this.PositionData !== null) {
        // Update User
        this.positionsService.updatePosition(this.PositionId).subscribe(res => {
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
        // Create User
        this.positionsService.createPosition(this.PositionData).subscribe(res => {
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
    }
  }

}
