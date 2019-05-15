import { Component, OnInit, Inject, Input } from '@angular/core';
import { Contract, DpsUser, Statute, Person, ContractStatus, DpsContract, _Position, Location, TimeSheet, DpsPostion, DpsWorkSchedule, WorkSchedule, SelectedContract } from 'src/app/shared/models';
import { MatDialog,MatDialogConfig, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatSnackBarConfig } from '@angular/material';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
import { ContractService } from 'src/app/shared/contract.service';
import { LocationsService } from 'src/app/shared/locations.service';
import { PersonService } from 'src/app/shared/person.service';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';
import { CancelContractComponent } from '../cancelcontract/cancelcontract.component';


@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css'] 
})

export class CreateContractComponent implements OnInit {
  ContractForm: FormGroup
  
  selectedStartYear: any;
  selectedStartMonth: any;
  selectedStartDay: any;

  selectedEndYear: any;
  selectedEndMonth: any;
  selectedEndDay: any;

  public maindatas = [];
  public SelectedIndex = -1;
  public dpsPositionsData = [];
  public dpsPosition : DpsPostion;
  positionSelected: string;
  public location : Location;
  public locationsData = [];
  locationSelected : any;  
  workScheduleSelected: any;
  public dpsWorkSchedulesData = []; 
  public dpsWorkSchedule : DpsWorkSchedule;
  public currentContract: DpsContract;
  public contract: Contract;
  public currentPerson: Person;
  public errorMsg;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  public selectedStartDate: any;
  public selectedEndDate: any;
  public statute: Statute;
    
  public personid: string;
  public contractId: number;
  public calendarData:string;
  public calendarDataNew:string;

  constructor(private positionsService: PositionsService, 
    private personService : PersonService, 
    private locationsService: LocationsService,
    private workschedulesService: WorkschedulesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public selectedContract: SelectedContract
  ) {
  }
  

  ngOnInit() {
    console.log('SelectedContract :: ' , this.selectedContract);
    this.contractId = this.selectedContract.contractId;
    this.personid = this.selectedContract.personId;
    console.log('Current Contract :: ', this.currentContract);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.ContractForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      position: new FormControl('', [Validators.required]),
      workSchedule: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required])
    });

    this.getPositionsByVatNumber();
    this.getLocationsByVatNumber();
    this.getWorkscheduleByVatNumber();
   

    if(this.contractId !== null && this.contractId !== undefined  && this.contractId !== 0 )
    {
      this.loadContract(this.VatNumber, this.contractId.toString()) ;
    }

    if(this.personid !== null && this.personid !== undefined  && this.personid !== '' )
    {
      this.loadPerson(this.personid, this.VatNumber) ;
    }

  }  

   loadPerson(personid: string, vatNumber : string) {
     this.personService.getPersonBySSIDVatnumber(personid,vatNumber).subscribe(response => {
      console.log('personid :: ', personid);  
      console.log('loadPerson :: ', response);   
       this.ContractForm.controls.firstname.setValue(response.body.person.firstName);
       this.ContractForm.controls.lastname.setValue(response.body.person.lastName);
     });
   }

  loadContract(vatNumber : string , cid: string) {    
    this.contractService.getContractByVatNoAndId( vatNumber, cid).subscribe(response => {
      console.log('loadContract :: ', response);
     
      this.currentContract = response;
     
      this.selectedStartYear =  new Date(response.contract.startDate).getFullYear();
      console.log('this.selectedStartYear  :: ', this.selectedStartYear  );
      this.selectedStartMonth =  new Date(response.contract.startDate).getMonth();
      console.log('this.selectedStartMonth :: ', this.selectedStartMonth );
      this.selectedStartDay =  new Date(response.contract.startDate).getDate();
      console.log('this.selectedStartDay :: ', this.selectedStartDay);
      
      this.calendarData = this.selectedStartDay + "/" + (this.selectedStartMonth+1) + "/" + this.selectedStartYear;

      console.log("calendar data="+this.calendarData);

      this.selectedEndYear =  new Date(response.contract.endDate).getFullYear();
      console.log('this.selectedEndYear  :: ', this.selectedEndYear  );
      this.selectedEndMonth =  new Date(response.contract.endDate).getMonth();
      console.log('this.selectedEndMonth :: ', this.selectedEndMonth );
      this.selectedEndDay =  new Date(response.contract.endDate).getDate();
      console.log('this.selectedEndDay :: ', this.selectedEndDay);
      
      this.calendarDataNew = this.selectedEndDay + "/" + (this.selectedEndMonth+1) + "/" + this.selectedEndYear;

      console.log(" calendarDataNew="+this.calendarDataNew);

      this.positionSelected = response.contract.position.name;
      this.locationSelected = response.locationId;
      this.workScheduleSelected = response.workScheduleId;    
      });     
  }

  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.currentContract;
      dialogConfig.ariaLabel = 'Arial Label Location Dialog';
      console.log('dialogConfig.data :: ', dialogConfig.data);
      const dialogRef = this.dialog.open(CancelContractComponent, dialogConfig);

      const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => {
        this.ShowMessage($event.MSG, $event.Action);
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.currentContract = result;
        console.log('this.data ::', this.currentContract);
        if (this.SelectedIndex > -1) {
          // maindatas Update Contract
          this.maindatas[this.SelectedIndex] = this.currentContract;        
          this.ShowMessage('cancelReason "' + this.currentContract.contract.cancelReason + '" is updated successfully.', '');
        } else {
          // maindatas Add Contract
          console.log('this.data.id :: ', this.currentContract.id);
          if (parseInt('0' + this.currentContract.id, 0) > 0) {
            this.maindatas.push(this.currentContract);
            console.log('New Contract Added Successfully :: ', this.maindatas);
           //this.FilterTheArchive();
            this.ShowMessage('Contract "' + this.currentContract.contract.name + '" is added successfully.', '');
          }
        }
      });
    } catch (e) { }
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
    console.log('start date ', $event);
    if ($event !== undefined && $event !== null) {
      this.selectedStartDate = $event;
      this.createObjects();
    }
  }
  receiveMessageEndDate($event) {
    console.log('end date ', $event);
    if ($event !== undefined && $event !== null) {
      this.selectedEndDate = $event;
      this.createObjects();
    }
  }

  updateData() {
    this.createObjects();
  }

  public getPosition() : DpsPostion{
    let dpsPositions = this.dpsPositionsData.filter(c => c.position.name == this.positionSelected);
    console.log('  dpsPositions :: ', dpsPositions[0]);   
    return  dpsPositions[0];
  }

  public getWorkSchedule(): DpsWorkSchedule
  {
    console.log('  this.workScheduleSelected :: ', this.workScheduleSelected);
    console.log('  dpsWorkSchedulesData :: ', this.dpsWorkSchedulesData);
    let  dpsWorkSchedules = this.dpsWorkSchedulesData.filter(c => c.id == this.workScheduleSelected);
    console.log('  dpsWorkSchedules :: ', dpsWorkSchedules[0]);
    return dpsWorkSchedules[0];
  }

  public getLocation(): Location{
    console.log('  this.locationSelected :: ', this.locationSelected);
    let locations = this.locationsData.filter(c => c.id == this.locationSelected);
    console.log('  locations :: ', locations[0]);
    return locations[0];
  }

  createObjects() {  

    this.currentContract = new DpsContract();
    this.contract = new Contract();
    console.log('  createObjects  :: ');   
     //this.contract.name = "";
     this.contract.startDate =  this.selectedStartDate.dayString + " " + this.selectedStartDate.monthString + " " + this.selectedStartDate.yearString;
     console.log('  contract.startDate  :: ', this.contract.startDate);
     this.contract.endDate = this.selectedEndDate.dayString + " " + this.selectedEndDate.monthString + " " + this.selectedEndDate.yearString;
     console.log('  contract.endDate  :: ', this.contract.endDate);
     this.contract.workSchedule = this.getWorkSchedule().workSchedule;
     console.log('  this.contract.workSchedule  :: ', this.contract.workSchedule);
     this.contract.position = this.getPosition().position;
     console.log('  this.contract.position  :: ', this.contract.position );
     this.contract.statute = new Statute(); 
     this.contract.status = ContractStatus.Active;
     this.contract.cancelReason = "";
    
     this.currentContract.id = 0;
     this.currentContract.customerVatNumber = this.VatNumber;
     this.currentContract.personId = this.personid;
     this.currentContract.positionId = this.getPosition().id;
     this.currentContract.locationId = this.getLocation().id;
     this.currentContract.workScheduleId = this.getWorkSchedule().id;
     this.currentContract.parentContractId = 0;
     this.currentContract.contract = this.contract;
     this.currentContract.timeSheet = new TimeSheet();

  }

  onApproveContractClick() {
    this.createObjects();
    console.log('currentContract ::', this.currentContract);
    // if (this.ContractForm.valid) {
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

    // } else {
    //   console.log('Form is Not Vaild');
    // }
  }


  onCancelContractClick(i) {
    this.SelectedIndex = this.contractId;
    console.log('Edit Clicked Index :: ' + this.SelectedIndex);
    //this.currentContract = this.maindatas[this.SelectedIndex];
    this.openDialog();
    return true;
  }


  getPositionsByVatNumber() {
    this.dpsPositionsData = [];
    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {
      response.forEach(element => { 
        this.dpsPositionsData.push(element);
      });  
      console.log('Positions Form Data : ', this.dpsPositionsData);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  getWorkscheduleByVatNumber() {
    this.dpsWorkSchedulesData = [];
    this.workschedulesService.getWorkscheduleByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {      
      response.forEach(element => {
        this.dpsWorkSchedulesData.push(element);  
      });
      console.log('DpsWorkSchedulesData Form Data : ', this.dpsWorkSchedulesData);   
      this.ShowMessage('WorkSchedules fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  getLocationsByVatNumber() {  
     this.locationsData = [];
    this.locationsService.getLocationByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {      
      response.forEach(element => {
        this.locationsData.push(element);        
      });
      console.log('locationsData Form Data : ', this.locationsData);
      this.ShowMessage('locationsData fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  onPositionsSelected(event) {
    console.log(event); //option value will be sent as event
  }

  onWorkScheduleSelected(event) {
    console.log(event); //option value will be sent as event
  }
  onLocationSelected(event) {
    console.log(event); //option value will be sent as event
  }
}







