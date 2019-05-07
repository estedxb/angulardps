import { Component, OnInit, Inject } from '@angular/core';
import { Contract, DpsUser, Statute, Person, DpsWorkSchedule } from 'src/app/shared/models';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatSnackBarConfig } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
import { ContractService } from 'src/app/shared/contract.service';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';


@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css']
})

export class CreatecontractComponent implements OnInit {
  ContractForm: FormGroup
  public positionsdata = [];
  positionSelected: string;
  public workSchedulesdata = [];
  workScheduleSelected: DpsWorkSchedule[];
  public currentContract: Contract;
  public currentPerson: Person;
  public errorMsg;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  
  public selectedStartDate: any;
  public selectedEndDate:any; 
    public statute :Statute;
    
 


  constructor(private positionsService: PositionsService,
    private workschedulesService: WorkschedulesService,
     private snackBar: MatSnackBar,
     private contractService: ContractService,
    ) { 
      
     }

  ngOnInit() {
    console.log('Current Contract :: ', this.currentContract);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.ContractForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      position: new FormControl('', [Validators.required]),
      workSchedule: new FormControl('', [Validators.required]),
     location: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])  
    });  

    this. getPositionsByVatNumber();
    this.getWorkscheduleByVatNumber();
    
  }

  loadPerson() {
    console.log('currentPerson :: ', this.currentPerson);
    if (this.currentPerson!== null &&this.currentPerson !== undefined) 
      {
        this.ContractForm.controls.firstname.setValue(this.currentPerson.firstName);
        this.ContractForm.controls.lastname.setValue(this.currentPerson.lastName);       
       }   
  }
  
  onPositionsSelected(event){
    console.log(event); //option value will be sent as event
   }

   onWorkScheduleSelected(event){
    console.log(event); //option value will be sent as event
   }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      console.log('Snackbar Action :: ' + Action);
    });
  }
  receiveMessageStartDate($event) {
     console.log('start date ' , $event );
     if ($event !== undefined && $event !== null) {   
      this.selectedStartDate =$event;    
      this.createObjects();
    }   
   }
   receiveMessageEndDate($event) {
    console.log('end date ' , $event );
    if ($event !== undefined && $event !== null) {
      this.selectedEndDate =$event;     
      this.createObjects();
    }
  }

  updateData() 
  {
     this.createObjects();
  }

  createObjects() {
   
    console.log('  positionSelected :: ', this.positionSelected);
    console.log('  workScheduleSelected :: ',  this.workScheduleSelected);
    console.log('  start dayString :: ', this.selectedStartDate.dayString);
    console.log('  start monthString :: ', this.selectedStartDate.monthString);
    console.log('  start yearString :: ', this.selectedStartDate.yearString);

    console.log('  end dayString :: ', this.selectedEndDate.dayString);
    console.log('  end monthString :: ', this.selectedEndDate.monthString);
    console.log('  end yearString :: ', this.selectedEndDate.yearString);
  
    this.currentContract.position.name = this.positionSelected;   
//this.currentContract.workSchedule = this.workScheduleSelected;   
    this.currentContract.timeSpan = this.selectedStartDate.dayString+" " +this.selectedStartDate.monthString+ " " + this.selectedStartDate.yearString + "-" +this.selectedEndDate.dayString+" " +this.selectedEndDate.monthString+ " " + this.selectedEndDate.yearString;
    this.currentContract.person = this.currentPerson;
    this.currentContract.statute = new Statute();
    this.currentContract.status = "status";
  }

  onApproveContractClick() {
    this.createObjects();
    console.log('currentContract ::', this.currentContract);
    if (this.ContractForm.valid) {
      if (this.currentContract !== undefined && this.currentContract !== null) {
          console.log('Create Contract');
          this.contractService.createContract(this.currentContract).subscribe(res => {
            console.log('  Contract Response :: ', res.body);
            this.currentContract = res.body;
            //this.dialogRef.close(this.currentContract);
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
      
    } else {
      console.log('Form is Not Vaild');
    }
  }


  getPositionsByVatNumber()
  {
    this.positionsdata = [];
    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {
       response.forEach(element => {
          this.positionsdata.push(element.position.name);
      });     
      console.log('Positions Form Data : ', this.positionsdata);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  getWorkscheduleByVatNumber()
  {
    this.workSchedulesdata = [];
    this.workschedulesService.getWorkscheduleByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {

      response.forEach(element => {
        this.workSchedulesdata.push(element); 
      }); 
      console.log('WorkSchedule Form Data : ', this.workSchedulesdata);   
      this.ShowMessage('WorkSchedules fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }
}






    
