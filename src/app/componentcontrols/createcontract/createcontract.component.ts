import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import {
  Contract, DpsUser, Statute, Person, ContractStatus, DpsContract, _Position, Location,
  TimeSheet, DpsPostion, DpsScheduleContract, DpsWorkSchedule, WorkSchedule, SelectedContract, ContractReason
} from 'src/app/shared/models';

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
import { ApproveContract, WorkDays } from '../../shared/models';
import { CalendarComponent } from '../calendar/calendar.component';
import { emit } from 'cluster';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css']
})

export class CreateContractComponent implements OnInit {
  @Output() public childEvent = new EventEmitter();

  ContractForm: FormGroup;

  public selectedStartDate: Date;
  public selectedEndDate: Date;

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
  public dpsPositionsData = [];
  public locationsData = [];
  public dpsWorkSchedulesData = [];
  public contractReasonDatas: ContractReason[] = [];

  public SelectedIndex = -1;
  positionSelectedId = 0;

  positionSelected: any;
  locationSelected: any;
  workScheduleSelected: any;
  contractReasonSelected: any;

  public dpsPosition: DpsPostion;
  public location: Location;
  public dpsWorkSchedule: DpsWorkSchedule;
  public contractReasons: ContractReason;
  public currentContract: DpsContract;
  public contract: Contract;
  public currentPerson: Person;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public isDpsUser: boolean = this.loginuserdetails.userRole === 'DPSAdmin' ? true : false;

  public VatNumber = this.loginuserdetails.customerVatNumber;
  public statute: Statute;

  public personid: string;
  public contractId: number;
  public calendarData: string;
  public calendarDataNew: string;
  public isStartDateVaild = true;
  public isEndDateVaild = true;
  public isSelectedDateDoesNotHaveWork = true;

  public isStartDateVaildErrorMsg = '';
  public isEndDateVaildErrorMsg = '';
  public isSelectedDateDoesNotHaveWorkErrorMsg = '';

  public contractAllowedDates: number[] = [];
  public errorMsg: string;

  public monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private positionsService: PositionsService,
    private personService: PersonService,
    private locationsService: LocationsService,
    private workschedulesService: WorkschedulesService,
    private snackBar: MatSnackBar,
    private logger: LoggingService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateContractComponent>,
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public selectedContract: SelectedContract) {
  }

  ngOnInit() {

    this.logger.log('SelectedContract :: ', this.selectedContract);

    this.getContractAllowedDates(this.selectedContract.personContracts);
    this.contractId = this.selectedContract.contractId;
    this.personid = this.selectedContract.personId;

    this.allowedStartDate = new Date(this.selectedContract.startDate);
    this.allowedStartYear = this.allowedStartDate.getFullYear();
    this.allowedStartMonth = this.allowedStartDate.getMonth();
    this.allowedStartDay = this.allowedStartDate.getDate();

    this.allowedEndDate = new Date(this.selectedContract.endDate);
    this.allowedEndYear = this.allowedEndDate.getFullYear();
    this.allowedEndMonth = this.allowedEndDate.getMonth();
    this.allowedEndDay = this.allowedEndDate.getDate();

    this.allowedExtentedStartDate = new Date(new Date(this.selectedContract.endDate).setDate(1));
    this.allowedExtentedStartYear = this.allowedExtentedStartDate.getFullYear();
    this.allowedExtentedStartMonth = this.allowedExtentedStartDate.getMonth();
    this.allowedExtentedStartDay = this.allowedExtentedStartDate.getDate();

    this.allowedExtentedEndDate = new Date(new Date(this.selectedContract.endDate).setDate(7));
    this.allowedExtentedEndYear = this.allowedExtentedEndDate.getFullYear();
    this.allowedExtentedEndMonth = this.allowedExtentedEndDate.getMonth();
    this.allowedExtentedEndDay = this.allowedEndDate.getDate();

    this.logger.log('ngOnInit allowedStartDate :: ', this.allowedStartDate);
    this.logger.log('ngOnInit allowedEndDate :: ', this.allowedEndDate);
    this.logger.log('ngOnInit allowedExtentedStartDate :: ', this.allowedExtentedStartDate);
    this.logger.log('ngOnInit allowedExtentedEndDate :: ', this.allowedExtentedEndDate);

    this.logger.log('Current Contract :: ', this.currentContract);
    this.logger.log('Current VatNumber : ' + this.VatNumber);

    this.ContractForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      position: new FormControl(''),
      workSchedule: new FormControl(''),
      location: new FormControl(''),
      calendarStartDate: new FormControl(''),
      calendarEndDate: new FormControl('')
    });

    // this.disableCancelButton();
    this.LoadContractReason();
    this.getPositionsByVatNumber();
  }

  getContractAllowedDates(dpsScheduleContracts: DpsScheduleContract[]) {
    try {
      // this.logger.log('getContractAllowedDates dpsScheduleContracts ', dpsScheduleContracts);
      if (this.selectedContract.personContracts !== null) {
        let contractCount = 0;
        dpsScheduleContracts.forEach(dpsScheduleContract => {
          // this.logger.log('getContractAllowedDates dpsScheduleContract[' + contractCount + ']', dpsScheduleContract);
          // this.logger.log('getContractAllowedDates dpsScheduleContract workSchedule', dpsScheduleContract.workSchedule);
          contractCount += 1;
          if (dpsScheduleContract.workSchedule !== null) {
            dpsScheduleContract.workSchedule.workDays.forEach(workDay => {
              this.logger.log('getContractAllowedDates workDay[' + workDay.dayOfWeek + '].workTimes', workDay.workTimes);
              let isWorkScheduleFound = false;
              if (workDay.workTimes !== null) {
                workDay.workTimes.forEach(workTime => {
                  this.logger.log('getContractAllowedDates work startTime ' + workTime.startTime + ' :: endTime ' + workTime.endTime);
                  if (!( // workTime.startTime === '00:00' && workTime.endTime === '00:00'
                    (parseInt(workTime.startTime.split(':')[0], 0) === 0 && parseInt(workTime.startTime.split(':')[1], 0) === 0) &&
                    (parseInt(workTime.endTime.split(':')[0], 0) === 0 && parseInt(workTime.endTime.split(':')[1], 0) === 0)
                  )) {
                    isWorkScheduleFound = true;
                    this.logger.log('getContractAllowedDates isWorkScheduleFound = ' + isWorkScheduleFound);
                  } else {
                    this.logger.log('getContractAllowedDates isWorkScheduleFound = False');
                  }
                });
              }
              if (!isWorkScheduleFound) { this.contractAllowedDates.push(workDay.dayOfWeek); }
              this.logger.log('getContractAllowedDates workDays loop end of' + workDay.dayOfWeek);
            });
          }
        });
      } else { this.contractAllowedDates = []; }
      this.logger.log('getContractAllowedDates contractAllowedDates', this.contractAllowedDates);
    } catch (e) {
      this.ShowMessage(e.message, '');
      this.logger.log('getContractAllowedDates Error! ', e.message);
    }
  }

  SetMode(mode: string) {
    this.mode = mode;
    this.logger.log('SetMode Mode :: ' + this.mode);
    if (this.mode === 'update') {
      this.loadContract(this.VatNumber, this.contractId.toString());
    } else if (this.mode === 'edit') {
      this.logger.log('Editing...');
      this.logger.log('SetMode mode this.selectedStartDate  :: ' + mode, this.selectedStartDate);
      this.logger.log('SetMode mode this.selectedEndDate  :: ' + mode, this.selectedEndDate);

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }

    } else if (this.mode === 'extend') {

      this.selectedStartDate = this.allowedExtentedStartDate;
      this.selectedStartYear = this.allowedExtentedStartYear;
      this.selectedStartMonth = this.allowedExtentedStartMonth;
      this.selectedStartDay = this.allowedExtentedStartDay;

      this.selectedEndDate = this.allowedExtentedEndDate;
      this.selectedEndYear = this.allowedExtentedEndYear;
      this.selectedEndMonth = this.allowedExtentedEndMonth;
      this.selectedEndDay = this.allowedExtentedEndDay;

      this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
      this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;

      this.logger.log('SetMode calendar data=' + this.calendarData);
      this.logger.log('SetMode calendarDataNew=' + this.calendarDataNew);
      this.logger.log('SetMode mode this.selectedStartDate  :: ' + mode, this.selectedStartDate);
      this.logger.log('SetMode mode this.selectedEndDate  :: ' + mode, this.selectedEndDate);

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }

    } else {

      this.selectedStartDate = this.allowedStartDate;
      this.selectedStartYear = this.allowedStartYear;
      this.selectedStartMonth = this.allowedStartMonth;
      this.selectedStartDay = this.allowedStartDay;

      this.selectedEndDate = this.allowedEndDate;
      this.selectedEndYear = this.allowedEndYear;
      this.selectedEndMonth = this.allowedEndMonth;
      this.selectedEndDay = this.allowedEndDay;

      this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
      this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;

      this.logger.log('SetMode calendar data=' + this.calendarData);
      this.logger.log('SetMode calendarDataNew=' + this.calendarDataNew);
      this.logger.log('SetMode mode this.selectedStartDate  :: ' + mode, this.selectedStartDate);
      this.logger.log('SetMode mode this.selectedEndDate  :: ' + mode, this.selectedEndDate);

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }

    }

  }

  loadPerson(personid: string, vatNumber: string) {
    this.personService.getPersonBySSIDVatnumber(personid, vatNumber).subscribe(response => {
      this.logger.log('personid :: ', personid);
      this.logger.log('loadPerson :: ', response);
      this.ContractForm.controls.firstname.setValue(response.body.person.firstName);
      this.ContractForm.controls.lastname.setValue(response.body.person.lastName);
    });
  }

  loadContract(vatNumber: string, cid: string) {
    this.contractService.getContractByVatNoAndId(vatNumber, cid).subscribe(response => {
      this.logger.log('loadContract :: ', response);

      this.currentContract = response;

      this.selectedStartDate = new Date(response.contract.startDate);
      this.selectedEndDate = new Date(response.contract.endDate);

      this.selectedStartYear = this.selectedStartDate.getFullYear();
      this.selectedStartMonth = this.selectedStartDate.getMonth();
      this.selectedStartDay = this.selectedStartDate.getDate();
      this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;

      this.selectedEndYear = this.selectedEndDate.getFullYear();
      this.selectedEndMonth = this.selectedEndDate.getMonth();
      this.selectedEndDay = this.selectedEndDate.getDate();
      this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;

      this.positionSelectedId = response.positionId;
      this.locationSelected = response.locationId;
      this.workScheduleSelected = response.workScheduleId;
      this.positionSelected = response.contract.position.name;
      this.contractReasonSelected = response.contract.contractReason;

      this.logger.log('loadContract this.selectedStartDate  :: ', this.selectedStartDate);
      this.logger.log('loadContract this.selectedEndDate  :: ', this.selectedEndDate);

      this.logger.log('loadContract this.selectedStartYear  :: ', this.selectedStartYear);
      this.logger.log('loadContract this.selectedStartMonth :: ', this.selectedStartMonth);
      this.logger.log('loadContract this.selectedStartDay :: ', this.selectedStartDay);
      this.logger.log('loadContract calendar data :: ' + this.calendarData);

      this.logger.log('loadContract this.selectedEndYear  :: ', this.selectedEndYear);
      this.logger.log('loadContract this.selectedEndMonth :: ', this.selectedEndMonth);
      this.logger.log('loadContract this.selectedEndDay :: ', this.selectedEndDay);
      this.logger.log('loadContract calendarDataNew :: ' + this.calendarDataNew);

      this.logger.log('loadContract this.contractReasonSelected :: ', this.contractReasonSelected);
      this.logger.log('loadContract this.positionSelectedId :: ', this.positionSelectedId);
      this.logger.log('loadContract this.locationSelected :: ', this.locationSelected);
      this.logger.log('loadContract this.workScheduleSelected :: ', this.workScheduleSelected);
      this.logger.log('loadContract this.positionSelected :: ', this.positionSelected);

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }

      // const selectedposition: DpsPostion = this.getPosition();
      // this.logger.log('loadContract Position :: ', selectedposition);

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
      this.logger.log('dialogConfig.data :: ', dialogConfig.data);
      const dialogRef = this.dialog.open(CancelContractComponent, dialogConfig);

      const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => {
        this.ShowMessage($event.MSG, $event.Action);
      });

      dialogRef.afterClosed().subscribe(result => {
        this.logger.log('The dialog was closed');

        this.currentContract = result;
        this.logger.log('this.data ::', this.currentContract);
        if (this.SelectedIndex > -1) {
          // maindatas Update Contract
          this.maindatas[this.SelectedIndex] = this.currentContract;
          this.ShowMessage('cancelReason "' + this.currentContract.contract.cancelReason + '" is updated successfully.', '');
        } else {
          // maindatas Add Contract
          this.logger.log('this.data.id :: ', this.currentContract.id);
          if (parseInt('0' + this.currentContract.id, 0) > 0) {
            this.maindatas.push(this.currentContract);
            this.logger.log('New Contract Added Successfully :: ', this.maindatas);
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
      this.logger.log('Snackbar Action :: ' + Action);
    });
  }

  receiveMessageStartDate($event) {
    this.logger.log('start date $event', $event);
    if ($event !== undefined && $event !== null) {
      this.logger.log('start date allowedStartDate', this.allowedStartDate);

      if (this.getDate($event) >= this.allowedStartDate) {
        if (this.getDate($event) <= this.selectedEndDate) {
          this.isStartDateVaild = true;
          this.isStartDateVaildErrorMsg = '';
          this.selectedStartDate = this.getDate($event);
          this.createObjects();
        } else {
          this.isStartDateVaild = false;
          this.isStartDateVaildErrorMsg = 'Please choose the date with in the selected week';
          this.ShowMessage(this.isStartDateVaildErrorMsg, '');
          this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
          // this.ContractForm.controls.calendarStartDate.value(this.selectedStartDate);
        }
      } else {
        this.isStartDateVaild = false;
        this.isStartDateVaildErrorMsg = 'Please choose the date with in the selected week';
        this.ShowMessage(this.isStartDateVaildErrorMsg, '');
        this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;

        // this.ContractForm.controls.calendarStartDate.value(this.selectedStartDate);
      }

      // this.selectedStartDate = new Date($event.yearString + '-' +
      // this.formateZero($event.monthString) + '-' + this.formateZero($event.dayString));
    }
  }

  receiveMessageEndDate($event) {
    this.logger.log('end date $event', $event);
    if ($event !== undefined && $event !== null) {
      this.logger.log('end date allowedEndDate', this.allowedEndDate);
      if (this.getDate($event) <= this.allowedEndDate) {

        if (this.getDate($event) >= this.selectedStartDate) {
          this.isEndDateVaild = true;
          this.isEndDateVaildErrorMsg = '';
          this.selectedEndDate = this.getDate($event);
          this.createObjects();
        } else {
          this.isEndDateVaild = false;
          this.isEndDateVaildErrorMsg = 'Please choose the date with in the selected week';
          this.ShowMessage(this.isEndDateVaildErrorMsg, '');
          this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
          // this.ContractForm.controls.calendarEndDate.value(this.selectedEndDate);
        }
      } else {
        this.isEndDateVaild = false;
        this.isEndDateVaildErrorMsg = 'Please choose the date with in the selected week';
        this.ShowMessage(this.isEndDateVaildErrorMsg, '');
        this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
        // this.ContractForm.controls.calendarEndDate.value(this.selectedEndDate);
      }
    }
  }

  updateData() {
    this.createObjects();
  }

  formateZero(n) {
    return n > 9 ? n : '0' + n;
  }

  public getPosition(): DpsPostion {
    const dpsPositions = this.dpsPositionsData.filter(p => p.id === this.positionSelectedId);
    this.logger.log('getPosition of ' + this.positionSelectedId);
    this.logger.log('getPosition dpsPositionsData :: ', this.dpsPositionsData);
    this.logger.log('getPosition  dpsPositions by positionSelectedId :: ' + this.positionSelectedId.toString(), dpsPositions[0]);
    return dpsPositions[0];
  }

  public getWorkSchedule(): DpsWorkSchedule {
    const dpsWorkSchedules = this.dpsWorkSchedulesData.filter(w => w.id === parseInt(this.workScheduleSelected, 0));
    this.logger.log('getWorkSchedule  this.workScheduleSelected :: ', this.workScheduleSelected);
    this.logger.log('getWorkSchedule  dpsWorkSchedulesData :: ', this.dpsWorkSchedulesData);
    this.logger.log('getWorkSchedule  dpsWorkSchedules by workScheduleSelected  :: ' + this.workScheduleSelected, dpsWorkSchedules[0]);
    return dpsWorkSchedules[0];
  }

  public getLocation(): Location {
    const locations = this.locationsData.filter(l => l.id === parseInt(this.locationSelected, 0));
    this.logger.log('getLocation  this.locationSelected :: ', this.locationSelected);
    this.logger.log('getLocation  locations by locations  :: ' + this.locationSelected, locations[0]);
    return locations[0];
  }

  createObjects() {
    this.currentContract = new DpsContract();
    this.contract = new Contract();

    this.contract.startDate = this.getDateString(this.selectedStartDate);
    this.contract.endDate = this.getDateString(this.selectedEndDate);

    this.logger.log('createObjects  :: ' + this.selectedStartDate, this.selectedEndDate);
    this.logger.log('createObjects  contract.startDate  :: ' + this.contract.startDate, this.selectedStartDate);
    this.logger.log('createObjects  contract.endDate  :: ' + this.contract.endDate, this.selectedEndDate);

    if (this.workScheduleSelected !== null && this.workScheduleSelected !== undefined) {
      this.contract.workSchedule = this.getWorkSchedule().workSchedule;
      this.currentContract.workScheduleId = this.getWorkSchedule().id;
      this.logger.log('createObjects workScheduleSelected not null', this.workScheduleSelected);
      this.logger.log('createObjects this.contract.workSchedule  :: ', this.contract.workSchedule);
    } else {
      this.contract.workSchedule = null;
      this.currentContract.workScheduleId = 0;
    }

    if (this.positionSelectedId > 0) {
      this.contract.position = this.getPosition().position;
      this.logger.log('createObjects positionSelected not null');
      this.logger.log('createObjects this.contract.position  :: ', this.contract.position);
    } else { this.contract.position = null; }

    if (this.locationSelected !== null && this.locationSelected !== undefined) {
      this.currentContract.locationId = this.getLocation().id;
      this.logger.log('createObjects locationSelected not null', this.locationSelected);
    } else { this.currentContract.locationId = 0; }

    this.contract.statute = new Statute();
    this.contract.status = ContractStatus.Active;
    this.contract.cancelReason = '';
    this.contract.contractReason = this.contractReasonSelected;

    this.currentContract.id = 0;
    this.currentContract.customerVatNumber = this.VatNumber;
    this.currentContract.personId = this.personid;
    this.currentContract.positionId = this.positionSelectedId;
    this.currentContract.parentContractId = 0;
    this.currentContract.contract = this.contract;
    this.currentContract.timeSheet = new TimeSheet();
  }

  onPrintContractClick() {
    this.contractService.getPrintContractPDFFileURL(this.VatNumber, this.contractId).subscribe(
      printContractPDFURLSuccess => {
        const FileURL = printContractPDFURLSuccess;
        saveAs(FileURL, 'PrintContract_' + this.VatNumber + '_' + this.contractId + '.pdf');
      },
      printContractPDFURLFailed => { this.ShowMessage('Fout! bij het afdrukken van het contract', ''); }
    );
  }

  onApproveContractClick() {
    this.logger.log('onApproveContractClick :: ');
    this.contractService.getApproveContract(this.VatNumber, this.contractId).subscribe(
      approveContractSuccess => {
        this.logger.log(approveContractSuccess);
        this.ShowMessage(approveContractSuccess.message, '');
        if (approveContractSuccess.accessStatus) {
          this.dialog.closeAll();
        } else {
          this.errorMsg = approveContractSuccess.message;
        }
      },
      approveContractFailed => {
        this.logger.log('approveContractFailed');
        this.ShowMessage('Fout! bij het goedkeuren van het contract', ''); // Error! in approving the contract
        this.logger.log('Approving the contract failed. ' + approveContractFailed);
      }
    );
  }

  onCreateOrUpdateContractClick() {
    this.createObjects();
    this.logger.log('currentContract ::', this.currentContract);
    if (this.isStartDateVaild && this.isEndDateVaild && this.isSelectedDateDoesNotHaveWork) {
      if (this.ContractForm.valid) {
        if (this.currentContract !== undefined && this.currentContract !== null) {
          this.logger.log('Create Contract');

          if (this.mode === 'update' || this.mode === 'edit') {
            this.currentContract.id = this.contractId;
          } else if (this.mode === 'extend') {
            this.currentContract.id = 0;
            this.currentContract.parentContractId = this.contractId;
          } else {
            this.currentContract.id = 0;
          }

          if (this.currentContract.positionId > 0) {
            if (this.currentContract.workScheduleId > 0) {
              if (this.currentContract.locationId > 0) {
                this.contractService.createContract(this.currentContract).subscribe(
                  res => {
                    this.logger.log('  Contract Response :: ', res.body);
                    this.currentContract = res.body;
                    this.ShowMessage('Contract succesvol opgeslagen', '');
                    this.dialogRef.close(this.currentContract);
                  },
                  (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                      this.logger.log('Error occured=' + err.error.message);
                    } else {
                      this.logger.log('response code=' + err.status);
                      this.logger.log('response body=' + err.error);
                    }
                  }
                );
              } else {
                this.logger.log('Please Select Location');
                this.ShowMessage('Selecteer alstublieft Plaats', '');
              }
            } else {
              this.logger.log('Please Select Workschedule');
              this.ShowMessage('Selecteer alstublieft werkschema', '');
            }
          } else {
            this.logger.log('Please Select Position');
            this.ShowMessage('Selecteer alstublieft Fuunctie', '');
          }
        } else {
          this.logger.log('Contract is undefined');
          this.ShowMessage('Contract is undefined', '');
        }
      } else {
        this.logger.log('Form is Not Vaild');
        if (this.ContractForm.controls.firstname) {
          this.ShowMessage('Form is Not Vaild', '');
        } else {
          this.ShowMessage('Form is Not Vaild', '');
        }
      }
    } else {
      let errormsgnew = '';
      errormsgnew = this.getErrorMsg(errormsgnew, this.isStartDateVaildErrorMsg);
      errormsgnew = this.getErrorMsg(errormsgnew, this.isEndDateVaildErrorMsg);
      errormsgnew = this.getErrorMsg(errormsgnew, this.isSelectedDateDoesNotHaveWorkErrorMsg);
      this.ShowMessage(errormsgnew, '');
    }
  }

  getErrorMsg(errormsgnew, AddMsg) {
    if (errormsgnew !== '' && errormsgnew !== undefined && errormsgnew !== null) {
      if (AddMsg !== '') { return errormsgnew + '/n' + AddMsg; } else { return errormsgnew; }
    } else { return AddMsg; }
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
    this.logger.log('Edit Clicked Index :: ' + this.SelectedIndex);
    // this.currentContract = this.maindatas[this.SelectedIndex];
    this.openDialog();
    return true;
  }

  /*
    disableCancelButton() {
      if (this.contractId === 0 || this.contractId === null || this.contractId === undefined) {
        (document.getElementById('btnCancelContract') as HTMLInputElement).disabled = true;
      }
    }
  */

  LoadContractReason() {
    this.logger.log('getContractReason ');
    this.contractService.getContractReason()
      .subscribe(contractReasons => {
        this.logger.log('LoadContractReason contractReasons', contractReasons);
        this.contractReasonDatas = contractReasons;
      }, error => this.errorMsg = error);
  }

  getPositionsByVatNumber() {
    this.dpsPositionsData = [];
    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {
      this.dpsPositionsData = response;
      // response.forEach(element => { this.dpsPositionsData.push(element); });
      this.logger.log('dpsPositionsData : ', this.dpsPositionsData);
      this.ShowMessage('Contract Positions fetched successfully.', '');
      this.logger.log('getPositionsByVatNumber this.contractId', this.contractId);

      this.getLocationsByVatNumber();

    }, error => this.ShowMessage(error, 'error'));
  }

  getWorkscheduleByVatNumber() {
    this.dpsWorkSchedulesData = [];
    this.workschedulesService.getWorkscheduleByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {
      this.dpsWorkSchedulesData = response;
      // response.forEach(element => { this.dpsWorkSchedulesData.push(element); });

      if (this.contractId !== null && this.contractId !== undefined && this.contractId !== 0) {
        this.SetMode('update');
      } else {
        this.SetMode('new');
      }

      if (this.personid !== null && this.personid !== undefined && this.personid !== '') {
        this.loadPerson(this.personid, this.VatNumber);
      }

      this.logger.log('DpsWorkSchedulesData Form Data : ', this.dpsWorkSchedulesData);
      this.ShowMessage('WorkSchedules fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  getLocationsByVatNumber() {
    this.locationsData = [];
    this.locationsService.getLocationByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(response => {
      this.locationsData = response;
      // response.forEach(element => { this.locationsData.push(element);});
      this.getWorkscheduleByVatNumber();
      this.logger.log('locationsData Form Data ::', this.locationsData);
      this.ShowMessage('locationsData fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  onPositionsSelected(event) {
    this.positionSelected = event;
    const dpsPositions = this.dpsPositionsData.filter(p => p.position.name === this.positionSelected);
    if (dpsPositions.length > 0) {
      this.positionSelectedId = dpsPositions[0].id;
    } else {
      this.positionSelectedId = 0;
    }
    this.logger.log('onPositionsSelected ::' + event); // option value will be sent as event
    this.logger.log('onPositionsSelected this.positionSelectedId :: ' + this.positionSelectedId); // option value will be sent as event
  }

  onReasonSelected(event) {
    this.contractReasonSelected = event;
    this.logger.log('onReasonSelected this.contractReasonSelected ::' + this.contractReasonSelected); // option value will be sent as event
  }

  onWorkScheduleSelected(event) {
    this.workScheduleSelected = event;
    this.logger.log('onWorkScheduleSelected :: ' + event); // option value will be sent as event
  }
  onLocationSelected(event) {
    this.locationSelected = event;
    this.logger.log('onLocationSelected :: ' + event); // option value will be sent as event
  }

  getCalanderDateObject(dt: Date) {
    this.logger.log('getCalanderDateObject :: ', dt);
    const returnDate = dt.getDate() + ' ' + this.monthNames[dt.getMonth()] + ' ' + dt.getFullYear();
    this.logger.log('getCalanderDateObject returnDate 3 :: ', returnDate);
    return returnDate;
  }

  getDateFromCalanderDateobject(CalanderDateobj: any) {
    const returnDate: string = CalanderDateobj.yearString + '-' + CalanderDateobj.monthString + '-' + CalanderDateobj.dayString;
    this.logger.log('getDateFromCalanderDateobject returnDate :: ', returnDate);
    return returnDate;
  }

  getDate(dt) {
    this.logger.log('getDate :: ', dt);
    const returnDate: Date = new Date(dt.yearString + '-' + dt.monthString + '-' + dt.dayString);
    this.logger.log('getDate returnDate :: ', returnDate);
    return returnDate;
  }

  getDateString(dt: Date) {
    this.logger.log('getDateString :: ', dt);
    const returnDate = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    this.logger.log('getDateString returnDate :: ', returnDate);
    return returnDate;
  }
}






