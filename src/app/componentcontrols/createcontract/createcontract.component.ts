import { Component, OnInit, Inject } from '@angular/core';
import { Contract, DpsUser } from 'src/app/shared/models';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContractService } from 'src/app/shared/contract.service';


@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css']
})
export class CreatecontractComponent implements OnInit {
  ContractForm: FormGroup
  public currentContract: Contract;
  Cdata : any;
  public errorMsg;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  public selectedStartMonth;
  public selectedStartDay;
  public selectedStartYear;

  public selectedEndMonth;
  public selectedEndDay;
  public selectedEndYear;

  constructor(
    private formBuilder: FormBuilder, private contractService: ContractService,
    public dialogRef: MatDialogRef<CreatecontractComponent>, @Inject(MAT_DIALOG_DATA) public locationdata: Location
  ) { 
  
  }

  ngOnInit() {
    console.log('Current Contract :: ', this.currentContract);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.ContractForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      position: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      workSchedule: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
     location: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])  
    });   
  }

  receiveMessageStartDate($event) {
     console.log('received in create contract component Cdata');
     if ($event !== undefined && $event !== undefined) {
      this.selectedStartDay = $event.dayString;
      this.selectedStartMonth = $event.monthString;
      this.selectedStartYear = $event.yearString;  
      this.createObjects();
    }   
   }
   receiveMessageEndDate($event) {
    if ($event !== undefined && $event !== undefined) {
      this.selectedEndDay = $event.dayString;
      this.selectedEndMonth = $event.monthString;
      this.selectedEndYear = $event.yearString;   
      this.createObjects();
    }    
  }

  updateData() { this.createObjects(); }

  createObjects() {
    this.currentContract.name = this.ContractForm.get('firstname').value +" "+ this.ContractForm.get('lastname').value;
    this.currentContract.position = this.ContractForm.get('position').value;
    this.currentContract.workSchedule = this.ContractForm.get('workSchedule').value;
    this.currentContract.timeSpan = this.selectedStartDay+""+this.selectedStartMonth+""+this.selectedStartYear+"-" +this.selectedEndDay+""+this.selectedEndMonth+""+this.selectedEndYear;
    this.currentContract.workSchedule = this.ContractForm.get('workSchedule').value;
  
  }

  onApproveContractClick() {
    this.createObjects();
    console.log('data ::', this.currentContract);
    if (this.ContractForm.valid) {
      if (this.currentContract !== undefined && this.currentContract !== null) {
          console.log('Create Contract');
          this.contractService.createContract(this.currentContract).subscribe(res => {
            console.log('  Location Response :: ', res.body);
            this.currentContract = res.body;
            this.dialogRef.close(this.currentContract);
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
          // this.dialogRef.close();
        }
      
    } else {
      console.log('Form is Not Vaild');
    }
  }


}

    
