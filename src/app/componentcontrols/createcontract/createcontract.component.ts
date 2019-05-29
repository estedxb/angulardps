import { Component, OnInit, Inject, Input } from '@angular/core';
import { Contract, DpsUser, Statute, Person, ContractStatus, DpsContract, _Position, Location, TimeSheet, DpsPostion, DpsWorkSchedule, WorkSchedule, SelectedContract } from 'src/app/shared/models';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatSnackBarConfig } from '@angular/material';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionsService } from 'src/app/shared/positions.service';
import { ContractService } from 'src/app/shared/contract.service';
import { LocationsService } from 'src/app/shared/locations.service';
import { PersonService } from 'src/app/shared/person.service';
import { WorkschedulesService } from 'src/app/shared/workschedules.service';
import { CancelContractComponent } from '../cancelcontract/cancelcontract.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css']
})

export class CreateContractComponent implements OnInit {
  ContractForm: FormGroup;

  public selectedStartDate: any;
  public selectedEndDate: any;

  public selectedStartYear: any;
  public selectedStartMonth: any;
  public selectedStartDay: any;

  public selectedEndYear: any;
  public selectedEndMonth: any;
  public selectedEndDay: any;

  public allowedStartDate: Date;
  public allowedEndDate: Date;

  public allowedStartYear: any;
  public allowedStartMonth: any;
  public allowedStartDay: any;

  public allowedEndYear: any;
  public allowedEndMonth: any;
  public allowedEndDay: any;

  public allowedExtentedStartDate: Date;
  public allowedExtentedEndDate: Date;

  public allowedExtentedStartYear: any;
  public allowedExtentedStartMonth: any;
  public allowedExtentedStartDay: any;

  public allowedExtentedEndYear: any;
  public allowedExtentedEndMonth: any;
  public allowedExtentedEndDay: any;
  public calendardayDisableStatus = null;
  public calendarmonthDisableStatus = null;
  public calendaryearDisableStatus = null;

  public mode = 'new';
  public maindatas = [];
  public SelectedIndex = -1;
  public dpsPositionsData = [];
  public dpsPosition: DpsPostion;
  positionSelected: any;
  positionSelectedId: any;
  public location: Location;
  public locationsData = [];
  locationSelected: any;
  workScheduleSelected: any;
  public dpsWorkSchedulesData = [];
  public dpsWorkSchedule: DpsWorkSchedule;
  public currentContract: DpsContract;
  public contract: Contract;
  public currentPerson: Person;
  public errorMsg;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public isDpsUser: boolean = this.loginuserdetails.userRole === 'DPSUser' ? true : false;

  public VatNumber = this.loginuserdetails.customerVatNumber;
  public statute: Statute;

  public personid: string;
  public contractId: number;
  public calendarData: string;
  public calendarDataNew: string;

  constructor(
    private positionsService: PositionsService,
    private personService: PersonService,
    private locationsService: LocationsService,
    private workschedulesService: WorkschedulesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public selectedContract: SelectedContract) {
  }

  ngOnInit() {
    console.log('SelectedContract :: ', this.selectedContract);
    this.contractId = this.selectedContract.contractId;
    this.personid = this.selectedContract.personId;

    this.allowedStartDate = this.selectedContract.startDate;
    this.allowedStartYear = this.allowedStartDate.getFullYear();
    this.allowedStartMonth = this.allowedStartDate.getMonth();
    this.allowedStartDay = this.allowedStartDate.getDate();

    this.allowedEndDate = this.selectedContract.endDate;
    this.allowedEndYear = this.allowedEndDate.getFullYear();
    this.allowedEndMonth = this.allowedEndDate.getMonth();
    this.allowedEndDay = this.allowedEndDate.getDate();

    this.allowedExtentedStartDate = new Date(this.selectedContract.endDate.setDate(1));
    this.allowedExtentedStartYear = this.allowedExtentedStartDate.getFullYear();
    this.allowedExtentedStartMonth = this.allowedExtentedStartDate.getMonth();
    this.allowedExtentedStartDay = this.allowedExtentedStartDate.getDate();

    this.allowedExtentedEndDate = new Date(this.allowedEndDate.setDate(7));
    this.allowedExtentedEndYear = this.allowedExtentedEndDate.getFullYear();
    this.allowedExtentedEndMonth = this.allowedExtentedEndDate.getMonth();
    this.allowedExtentedEndDay = this.allowedEndDate.getDate();

    console.log('Current Contract :: ', this.currentContract);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.ContractForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      position: new FormControl('', [Validators.required]),
      workSchedule: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      btnCancelContract: new FormControl('')
    });
    // this.disableCancelButton();
    this.getPositionsByVatNumber();
    this.getLocationsByVatNumber();
    this.getWorkscheduleByVatNumber();

    if (this.personid !== null && this.personid !== undefined && this.personid !== '') {
      this.loadPerson(this.personid, this.VatNumber);
    }
  }

  SetMode(mode: string) {
    this.mode = mode;
    if (mode === 'update') {
      this.loadContract(this.VatNumber, this.contractId.toString());
    } else if (mode === 'edit') {

    } else if (mode === 'extend') {
      this.selectedStartDate = this.allowedExtentedStartDate;
      this.selectedEndDate = this.allowedExtentedEndDate;

      this.selectedStartYear = this.allowedExtentedStartYear;
      this.selectedStartMonth = this.allowedExtentedStartMonth;
      this.selectedStartDay = this.allowedExtentedStartDay;
      this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
      console.log('SetMode calendar data=' + this.calendarData);

      this.selectedEndYear = this.allowedExtentedEndYear;
      this.selectedEndMonth = this.allowedExtentedEndMonth;
      this.selectedEndDay = this.allowedExtentedEndDay;
      this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
      console.log('SetMode calendarDataNew=' + this.calendarDataNew);
    } else {
      this.selectedStartDate = this.allowedStartDate;
      this.selectedEndDate = this.allowedEndDate;
      this.selectedStartYear = this.allowedStartYear;
      this.selectedStartMonth = this.allowedStartMonth;
      this.selectedStartDay = this.allowedStartDay;
      this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
      console.log('SetMode calendar data=' + this.calendarData);

      this.selectedEndYear = this.allowedEndYear;
      this.selectedEndMonth = this.allowedEndMonth;
      this.selectedEndDay = this.allowedEndDay;
      this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
      console.log('SetMode calendarDataNew=' + this.calendarDataNew);
    }

    console.log('SetMode mode this.selectedStartDate  :: ' + mode, this.selectedStartDate);
    console.log('SetMode mode this.selectedEndDate  :: ' + mode, this.selectedEndDate);

    if (this.selectedStartYear === this.selectedEndYear) {
      this.calendaryearDisableStatus = true;
    } else {
      this.calendaryearDisableStatus = false;
    }
    if (this.selectedStartMonth === this.selectedEndMonth) {
      this.calendarmonthDisableStatus = true;
    } else {
      this.calendarmonthDisableStatus = false;
    }

  }

  loadPerson(personid: string, vatNumber: string) {
    this.personService.getPersonBySSIDVatnumber(personid, vatNumber).subscribe(response => {
      console.log('personid :: ', personid);
      console.log('loadPerson :: ', response);
      this.ContractForm.controls.firstname.setValue(response.body.person.firstName);
      this.ContractForm.controls.lastname.setValue(response.body.person.lastName);
    });
  }

  loadContract(vatNumber: string, cid: string) {
    this.contractService.getContractByVatNoAndId(vatNumber, cid).subscribe(response => {
      console.log('loadContract :: ', response);

      this.currentContract = response;

      this.selectedStartDate = response.contract.startDate;
      this.selectedEndDate = response.contract.endDate;
      console.log('loadContract this.selectedStartDate  :: ', this.selectedStartDate);
      console.log('loadContract this.selectedEndDate  :: ', this.selectedEndDate);

      this.selectedStartYear = new Date(response.contract.startDate).getFullYear();
      console.log('loadContract this.selectedStartYear  :: ', this.selectedStartYear);
      this.selectedStartMonth = new Date(response.contract.startDate).getMonth();
      console.log('loadContract this.selectedStartMonth :: ', this.selectedStartMonth);
      this.selectedStartDay = new Date(response.contract.startDate).getDate();
      console.log('loadContract this.selectedStartDay :: ', this.selectedStartDay);

      this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
      console.log('loadContract calendar data=' + this.calendarData);

      this.selectedEndYear = new Date(response.contract.endDate).getFullYear();
      console.log('loadContract this.selectedEndYear  :: ', this.selectedEndYear);
      this.selectedEndMonth = new Date(response.contract.endDate).getMonth();
      console.log('loadContract this.selectedEndMonth :: ', this.selectedEndMonth);
      this.selectedEndDay = new Date(response.contract.endDate).getDate();
      console.log('loadContract this.selectedEndDay :: ', this.selectedEndDay);

      this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;

      console.log('loadContract calendarDataNew=' + this.calendarDataNew);

      this.positionSelectedId = response.positionId;
      console.log('loadContract this.positionSelectedId :: ', this.positionSelectedId);
      this.locationSelected = response.locationId;
      console.log('loadContract this.locationSelected :: ', this.locationSelected);

      this.workScheduleSelected = response.workScheduleId;
      console.log('loadContract this.workScheduleSelected :: ', this.workScheduleSelected);

      const p: DpsPostion = this.getPosition();
      console.log('loadContract Position :: ', p);
      this.positionSelected = p.position.name; //  response.contract.position.name; //
      console.log('loadContract this.positionSelected :: ', this.positionSelected);

    });
  }

  clearCtrl() {

  }

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
            // this.FilterTheArchive();
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
      this.selectedStartDate = new Date($event.yearString + '-' + this.formateZero($event.monthString) + '-' + this.formateZero($event.dayString));
      this.createObjects();
    }
  }
  receiveMessageEndDate($event) {
    console.log('end date ', $event);
    if ($event !== undefined && $event !== null) {
      this.selectedEndDate = new Date($event.yearString + '-' + this.formateZero($event.monthString) + '-' + this.formateZero($event.dayString));
      this.createObjects();
    }
  }

  updateData() {
    this.createObjects();
  }

  formateZero(n) {
    return n > 9 ? n : '0' + n;
  }

  public getPosition(): DpsPostion {
    console.log('getPosition of ' + this.positionSelectedId);
    console.log('getPosition dpsPositionsData :: ', this.dpsPositionsData);
    const dpsPositions = this.dpsPositionsData.filter(p => p.id === parseInt(this.positionSelectedId, 0));
    console.log('getPosition  dpsPositions by positionSelectedId :: ' + this.positionSelectedId, dpsPositions[0]);
    return dpsPositions[0];
  }

  public getWorkSchedule(): DpsWorkSchedule {
    console.log('getWorkSchedule  this.workScheduleSelected :: ', this.workScheduleSelected);
    console.log('getWorkSchedule  dpsWorkSchedulesData :: ', this.dpsWorkSchedulesData);
    const dpsWorkSchedules = this.dpsWorkSchedulesData.filter(w => w.id === parseInt(this.workScheduleSelected, 0));
    console.log('getWorkSchedule  dpsWorkSchedules by workScheduleSelected  :: ' + this.workScheduleSelected, dpsWorkSchedules[0]);
    return dpsWorkSchedules[0];
  }

  public getLocation(): Location {
    console.log('getLocation  this.locationSelected :: ', this.locationSelected);
    const locations = this.locationsData.filter(l => l.id === parseInt(this.locationSelected, 0));
    console.log('getLocation  locations by locations  :: ' + this.locationSelected, locations[0]);
    return locations[0];
  }

  createObjects() {

    this.currentContract = new DpsContract();
    this.contract = new Contract();
    console.log('createObjects  :: ', this.selectedStartDate, this.selectedEndDate);
    // this.contract.name = "";
    this.contract.startDate = this.selectedStartDate;
    console.log('createObjects  contract.startDate  :: ', this.contract.startDate);
    this.contract.endDate = this.selectedEndDate;
    console.log('createObjects  contract.endDate  :: ', this.contract.endDate);

    this.contract.workSchedule = this.getWorkSchedule().workSchedule;
    console.log('createObjects this.contract.workSchedule  :: ', this.contract.workSchedule);

    this.contract.position = this.getPosition().position;
    console.log('createObjects this.contract.position  :: ', this.contract.position);

    this.contract.statute = new Statute();
    this.contract.status = ContractStatus.Active;
    this.contract.cancelReason = '';

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

  onPrintContractClick() {
    console.log('onPrintContractClick :: ');
    this.contractService.getPrintContractPDFFileURL(this.VatNumber, this.contractId).subscribe(printContractPDF => {
      console.log(printContractPDF);
      const FileURL = printContractPDF.fileUrl;
      saveAs(FileURL, 'PrintContract_' + this.VatNumber + '_' + this.contractId + '.pdf');
    });
  }
  onApproveContractClick() {
    console.log('onApproveContractClick :: ');
    this.contractService.getApproveContract(this.VatNumber, this.contractId).subscribe(approveContractSuccess => {
      console.log(approveContractSuccess);
      this.ShowMessage(approveContractSuccess.message, '');
      if (approveContractSuccess.accessStatus) {
        this.dialog.closeAll();
      } else {
        this.errorMsg = approveContractSuccess.message;
      }
    });
  }

  onCreateOrUpdateContractClick() {
    this.createObjects();

    console.log('currentContract ::', this.currentContract);
    if (this.ContractForm.valid) {
      if (this.currentContract !== undefined && this.currentContract !== null) {
        console.log('Create Contract');
        this.contractService.createContract(this.currentContract).subscribe(res => {
          console.log('  Contract Response :: ', res.body);
          this.currentContract = res.body;
          // this.dialogRef.close(this.currentContract);
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

  onEnableEdit() {
    this.SetMode('edit');
  }

  onCancelEdit() {
    if (this.mode === 'edit' || this.mode === 'extend') {
      this.SetMode('update');
    } else {
      this.dialog.closeAll();
    }
  }
  onExtented() {
    this.SetMode('extend');
  }

  onCancelContractClick() {
    this.SelectedIndex = this.contractId;
    console.log('Edit Clicked Index :: ' + this.SelectedIndex);
    // this.currentContract = this.maindatas[this.SelectedIndex];
    this.openDialog();
    return true;
  }



  disableCancelButton() {
    if (this.contractId === 0 || this.contractId === null || this.contractId === undefined) {
      (document.getElementById('btnCancelContract') as HTMLInputElement).disabled = true;
    }
  }


  getPositionsByVatNumber() {
    this.dpsPositionsData = [];
    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {
      response.forEach(element => {
        this.dpsPositionsData.push(element);
      });
      console.log('dpsPositionsData : ', this.dpsPositionsData);
      this.ShowMessage('Contract Positions fetched successfully.', '');
      console.log('getPositionsByVatNumber this.contractId', this.contractId);

      if (this.contractId !== null && this.contractId !== undefined && this.contractId !== 0) {
        this.SetMode('update');
      } else {
        this.SetMode('new');
      }

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
    console.log(event); // option value will be sent as event
  }

  onWorkScheduleSelected(event) {
    console.log(event); // option value will be sent as event
  }
  onLocationSelected(event) {
    console.log(event); // option value will be sent as event
  }
}







