
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import {
  Contract, DpsUser, Statute, Person, ContractStatus, DpsContract, _Position, Location, LoginToken, ApproveContract, WorkDays,
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
import { CalendarComponent } from 'src/app/componentcontrols/calendar/calendar.component';
import { emit } from 'cluster';
import { LoggingService } from 'src/app/shared/logging.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DPSSystemMessageComponent } from '../../../../componentcontrols/dpssystem-message/dpssystem-message.component';

@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css']
})

export class CreateContractComponent implements OnInit {
  // @Output() public childEvent = new EventEmitter();

  ContractForm: FormGroup;
  public selectedWeekDays: number[] = [];
  public contractWorkingDates: number[] = [];
  public selectedStartDate: Date;
  public selectedEndDate: Date;
  public Contract = 'Contract';
  public isApproved = false;

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

  public calendardayDisableStatus = null;
  public calendarmonthDisableStatus = null;
  public calendaryearDisableStatus = null;
  public showLoading = false;
  public mode = 'new';
  public maindatas = [];
  public dpsPositionsData: DpsPostion[] = [];
  public locationsData = [];
  public dpsWorkSchedulesData: DpsWorkSchedule[] = [];
  public contractReasonDatas: ContractReason[] = [];

  public positionSelectedName: any;
  public locationSelectedName: any;
  public workScheduleSelected: any;
  public contractReasonSelectedName: any;

  public dpsPosition: DpsPostion;
  public location: Location;
  public dpsWorkSchedule: DpsWorkSchedule;
  public contractReasons: ContractReason;
  public currentDpsContract: DpsContract;
  public contract: Contract;
  public currentPerson: Person;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public isDpsUser: boolean = this.dpsLoginToken.userRole === 'DPSAdmin' ? true : false;

  public VatNumber = this.dpsLoginToken.customerVatNumber;
  public statute: Statute;

  public personid = '0';
  public contractId = 0;
  public SelectedIndex = -1;
  public positionSelectedId = 0;
  public calendarData: string;
  public calendarDataNew: string;
  public isStartDateVaild = true;
  public isEndDateVaild = true;
  public isSelectedWeeksVaild = true;
  public isSelectedDateDoesNotHaveWork = true;
  public isWorkScheduleVaild = false;
  public isLocationVaild = false;

  public isStartDateVaildErrorMsg = '';
  public isEndDateVaildErrorMsg = '';
  public isSelectedWeeksVaildErrorMsg = '';
  public isSelectedDateDoesNotHaveWorkErrorMsg = ''; // 'Werkschema heeft geen werkdagen voor de geselecteerde datums';
  public isWorkScheduleVaildErrorMsg = 'Selecteer het juiste Werkrooster';
  public isLocationVaildErrorMsg = 'Selecteer de Vestiging';
  public SpinnerShowing = false;
  public allowCreateContract = false;
  public personIsEnabled = false;
  public personIsArchived = true;

  public errorMsg: string;
  public componentname = 'CreateContractComponent ';

  public monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  ShowMessage(msg, action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    this.logger.log('ShowMessageCustom ', msg);
    const snackbarRef = this.snackBar.open(msg, action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => { this.logger.log('Snackbar Action :: ' + action); });
  }

  ShowMessageCustom(title, msg, action = '') {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    this.logger.log('ShowMessageCustom ', msg);
    const snackbarRef = this.snackBar.openFromComponent(DPSSystemMessageComponent, {
      verticalPosition: 'top', duration: 5000, data: { Title: title, MSG: msg }
    });
    snackbarRef.onAction().subscribe(() => { this.logger.log('Snackbar Action :: ' + action); });
  }

  formateZero(n) { return n > 9 ? n : '0' + n; }

  getDateFromCalanderDateobject(CalanderDateobj: any) {
    this.logger.log('getDateFromCalanderDateobject(CalanderDateobj)', CalanderDateobj);
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

  getCalanderDateObject(dt: Date) {
    this.logger.log('getCalanderDateObject :: ', dt);
    const returnDate = dt.getDate() + ' ' + this.monthNames[dt.getMonth()] + ' ' + dt.getFullYear();
    this.logger.log('getCalanderDateObject returnDate 3 :: ', returnDate);
    return returnDate;
  }

  showSpinner() {
    if (!this.SpinnerShowing) {
      this.SpinnerShowing = true;
      this.spinner.startLoader('loader-01');
    }
  }
  hideSpinner() {
    if (this.SpinnerShowing) {
      this.spinner.stopLoader('loader-01');
      this.SpinnerShowing = false;
    }
  }

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
    private spinner: NgxUiLoaderService,
    @Inject(MAT_DIALOG_DATA) public selectedContract: SelectedContract) { }

  ngOnInit() {
    this.showSpinner();
    setTimeout(() => { this.hideSpinner(); }, 3000);
    this.onPageInit();
  }

  onPageInit() {

    this.showLoading = true;
    this.logger.log('SelectedContract :: ', this.selectedContract);
    this.contractId = this.selectedContract.contractId;
    this.personid = this.selectedContract.personId;
    this.mode = this.selectedContract.mode;
    this.allowCreateContract = this.selectedContract.allowCreateContract;
    this.personIsEnabled = this.selectedContract.personIsEnabled;
    this.personIsArchived = this.selectedContract.personIsArchived;

    this.logger.log('Current Contract ID :: ' + this.contractId);
    this.logger.log('Current VatNumber : ' + this.VatNumber);

    // Get the form controls for managing the control data
    this.ContractForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]+$')]),
      position: new FormControl(''),
      contractReason: new FormControl(''),
      workSchedule: new FormControl(''),
      location: new FormControl(''),
      calendarStartDate: new FormControl(''),
      calendarEndDate: new FormControl('')
    });

    // Setting the Dates Allowed Ranges
    this.setDatesRanges();
    // Getting the workdays of the person in other contracts for the selected week
    this.getContractWorkingWeekDays(this.selectedContract.personContracts);
    // Loading the form Datas Starts from get Location first
    this.getLocationsByVatNumber();
  }

  // Setting the Dates Allowed Ranges
  setDatesRanges() {
    this.allowedStartDate = new Date(this.selectedContract.startDate);
    this.allowedStartYear = this.allowedStartDate.getFullYear();
    this.allowedStartMonth = this.allowedStartDate.getMonth();
    this.allowedStartDay = this.allowedStartDate.getDate();
    this.allowedEndDate = new Date(this.selectedContract.endDate);
    this.allowedEndYear = this.allowedEndDate.getFullYear();
    this.allowedEndMonth = this.allowedEndDate.getMonth();
    this.allowedEndDay = this.allowedEndDate.getDate();
    this.logger.log('setDatesRanges allowedStartDate :: ', this.allowedStartDate);
    this.logger.log('setDatesRanges allowedEndDate :: ', this.allowedEndDate);
  }

  // Getting the workdays of the person in other contracts for the selected week
  getContractWorkingWeekDays(dpsScheduleContracts: DpsScheduleContract[]) {
    try {
      let contractCount = 0;
      this.logger.log('getContractWorkingWeekDays dpsScheduleContracts ', dpsScheduleContracts);
      // Checking the Person Has Contract or Not
      if (this.selectedContract.personContracts !== null) {
        // Looping the person contracts to find working schedule days
        dpsScheduleContracts.forEach(dpsScheduleContract => {
          contractCount += 1;
          // Avoiding the selected contract for editing
          if (dpsScheduleContract.customerContractId !== this.contractId.toString()) {
            // Avoiding the contracts does not have work schedules
            if (dpsScheduleContract.workSchedule !== null) {
              // Looping the work schedule days of the current contract
              dpsScheduleContract.workSchedule.workDays.forEach(workDay => {
                this.logger.log('getContractWorkingWeekDays workDay[' + workDay.dayOfWeek + '].workTimes', workDay.workTimes);
                let isWorkScheduleFound = false;
                // Checking the workday has working times
                if (workDay.workTimes !== null) {
                  // Looping the workday working times to find the working day has working time
                  workDay.workTimes.forEach(workTime => {
                    this.logger.log('getContractWorkingWeekDays work startTime ' + workTime.startTime + ' :: endTime ' + workTime.endTime);

                    // Checking Start time and end time is not 00:00
                    if (!(
                      (parseInt(workTime.startTime.split(':')[0], 0) === 0 && parseInt(workTime.startTime.split(':')[1], 0) === 0) &&
                      (parseInt(workTime.endTime.split(':')[0], 0) === 0 && parseInt(workTime.endTime.split(':')[1], 0) === 0)
                    )) {
                      // If StartTime and EndTime is not 00:00 the Work Found
                      isWorkScheduleFound = true;
                      this.logger.log('getContractWorkingWeekDays isWorkScheduleFound = true');
                    } else {
                      // Work not Found so no need to change the isWorkScheduleFound because we already set it in initialzing with false 
                      // so only we need to change true if we found work for the day
                      this.logger.log('getContractWorkingWeekDays isWorkScheduleFound = False');
                    }
                  });
                }
                // If the work schedule found for the week day then add this weekday to the already has workdays (contractWorkingDates) 
                if (isWorkScheduleFound) { this.contractWorkingDates.push(workDay.dayOfWeek); }
                this.logger.log('getContractWorkingWeekDays workDays (' + isWorkScheduleFound +
                  ') loop end of ' + workDay.dayOfWeek, this.contractWorkingDates);
              });
            } else {
              // if there is no contract for the person other then the selected contract for editing then contractWorkingDates is null
              if (this.selectedContract.personContracts.length === 1) { this.contractWorkingDates = []; }
              this.logger.log('getContractWorkingWeekDays this contract skiped because this is the selected contract');
            }
          }
        });
      } else {
        // if there is no contract for the person then contractWorkingDates is null
        this.contractWorkingDates = [];
        this.logger.log('getContractWorkingWeekDays this contract skiped because no contracts for selected days');
      }

      this.logger.log('getContractWorkingWeekDays contractWorkingDates for contractCount(' + contractCount + ')',
        this.contractWorkingDates);
    } catch (e) {
      this.ShowMessage(e.message, 'error');
      this.logger.log('getContractWorkingWeekDays Error! ', e.message);
    }
  }

  getLocationsByVatNumber() {
    this.locationsData = [];
    this.showSpinner();
    this.locationsService.getLocationByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(response => {
      this.locationsData = response;

      if (this.locationsData.length > 0) {
        this.locationSelectedName = this.locationsData[0].id;
        this.isLocationVaildErrorMsg = '';
        this.isLocationVaild = true;
        this.getWorkscheduleByVatNumber();
        this.logger.log('locationsData Form Data ::', this.locationsData);
      } else {
        this.isLocationVaildErrorMsg = 'Selecteer de Vestiging';
        this.isLocationVaild = false;

        this.ShowMessage('Voeg de locatie toe voordat u een contract aanmaakt', '');
        this.hideSpinner();
        this.dialogRef.close(null);
      }
      // this.hideSpinner();
      // this.ShowMessage('locationsData fetched successfully.', '');
    }, error => this.errorHandle(error));
  }

  getWorkscheduleByVatNumber() {
    this.dpsWorkSchedulesData = [];
    this.showSpinner();
    this.workschedulesService.getWorkscheduleByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(response => {
      this.dpsWorkSchedulesData = response;

      if (this.dpsWorkSchedulesData.length > 0) {
        this.workScheduleSelected = this.dpsWorkSchedulesData[0].id;
        this.getContractReason();
      } else {
        this.ShowMessage('Voeg het werkschema toe voordat u een contract maakt', '');
        this.hideSpinner();
        this.dialogRef.close(null);
      }

      /*
        if (this.contractId !== null && this.contractId !== undefined && this.contractId !== 0) {
          this.SetMode('update');
        } else {
          this.SetMode('new');
        }
      */

      // this.ShowMessage('WorkSchedules fetched successfully.', '');
    }, error => this.errorHandle(error));
  }

  getContractReason() {
    this.logger.log('getContractReason ');
    this.showSpinner();
    this.contractService.getContractReason()
      .subscribe(contractReasons => {
        this.logger.log('LoadContractReason contractReasons', contractReasons);
        this.contractReasonDatas = contractReasons;
        if (this.contractReasonDatas.length > 0) {
          this.contractReasonSelectedName = this.contractReasonDatas[0].BrightStaffing_Contract_Reason_ID;
        }
        this.getPositionsByVatNumber();
        // this.hideSpinner();
      }, error => this.errorHandle(error));
  }

  getPositionsByVatNumber() {
    this.dpsPositionsData = [];
    this.showSpinner();
    this.positionsService.getPositionsByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(response => {
      this.dpsPositionsData = response;
      this.logger.log('dpsPositionsData : ', this.dpsPositionsData);
      // this.ShowMessage('Contract Positions fetched successfully.', '');
      // this.getLocationsByVatNumber();

      if (this.personid !== null && this.personid !== undefined && this.personid !== '') {
        this.loadPerson(this.personid, this.VatNumber);
      } else {
        this.ShowMessage('Persoon niet geselecteerd', '');
        this.hideSpinner();
        this.dialogRef.close(null);
      }

      // this.hideSpinner();
    }, error => this.errorHandle(error));
  }


  loadPerson(personid: string, vatNumber: string) {
    this.showSpinner();
    this.personService.getPersonBySSIDVatnumber(personid, vatNumber).subscribe(personinfo => {
      this.logger.log('personid :: ', personid);
      this.logger.log('loadPerson :: ', personinfo);
      this.ContractForm.controls.firstname.setValue(personinfo.person.firstName);
      this.ContractForm.controls.lastname.setValue(personinfo.person.lastName);
      this.positionSelectedId = parseInt('0' + personinfo.customerPostionId, 0);
      this.logger.log('loadPerson dpsPositionsData :: ', this.dpsPositionsData);
      const dpsPositions = this.dpsPositionsData.filter(p => p.id === this.positionSelectedId);
      this.logger.log('dpsPositions :: ', dpsPositions);
      if (dpsPositions.length > 0) {
        this.SetMode();
        if (this.mode === 'new') {
          this.positionSelectedName = dpsPositions[0].position.name;
          setTimeout(() => {
            this.logger.log('positionSelectedName 2 :: ' + this.positionSelectedName, dpsPositions[0]);
            this.currentDpsContract.contract.position = dpsPositions[0].position;
            this.currentDpsContract.contract.statute = personinfo.statute;
            this.hideSpinner();
          }, 100);
        }
      } else {
        this.SetMode();
        if (this.mode === 'new') {
          this.positionSelectedName = 'Positie niet gevonden';
          setTimeout(() => {
            this.logger.log('positionSelectedName 1 ::' + this.positionSelectedName);
            this.currentDpsContract.contract.position = null;
            this.currentDpsContract.contract.statute = personinfo.statute;
            this.hideSpinner();
          }, 100);
        }
      }

      this.logger.log('loadPerson currentDpsContract  ', this.currentDpsContract);
      // this.hideSpinner();
    }, error => this.errorHandle(error));
  }

  SetMode() {
    this.showSpinner();
    this.logger.log('SetMode Mode :: ' + this.mode);
    if (this.mode === 'edit') {
      this.currentDpsContract.id = this.contractId;
      this.loadContract(this.VatNumber, this.contractId.toString());
      this.logger.log('SetMode update contract - this.selectedStartDate  :: ' + this.mode, this.selectedStartDate);
      this.logger.log('SetMode update contract - this.selectedEndDate  :: ' + this.mode, this.selectedEndDate);

    } else if (this.mode === 'update' || this.mode === 'extend') {
      this.loadContract(this.VatNumber, this.contractId.toString());
    } else {
      this.contractId = 0;

      this.logger.log('this.selectedStartDate 3 before', this.selectedStartDate);
      this.selectedStartDate = new Date(this.allowedStartDate);
      this.logger.log('this.selectedStartDate 3 after', this.selectedStartDate);
      this.selectedStartYear = this.allowedStartYear;
      this.selectedStartMonth = this.allowedStartMonth;
      this.selectedStartDay = this.allowedStartDay;

      this.logger.log('this.selectedEndDate 3 before', this.selectedEndDate);
      this.selectedEndDate = new Date(this.allowedEndDate);
      this.logger.log('this.selectedEndDate 3 after', this.selectedEndDate);
      this.selectedEndYear = this.allowedEndYear;
      this.selectedEndMonth = this.allowedEndMonth;
      this.selectedEndDay = this.allowedEndDay;

      this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
      this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;

      this.logger.log('SetMode create contract - calendar data=' + this.calendarData);
      this.logger.log('SetMode create contract - calendarDataNew=' + this.calendarDataNew);
      this.logger.log('SetMode create contract - this.selectedStartDate  :: ' + this.mode, this.selectedStartDate);
      this.logger.log('SetMode create contract - this.selectedEndDate  :: ' + this.mode, this.selectedEndDate);

      this.createCurrentDpsContract();

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }
    }
  }

  createCurrentDpsContract() {

    this.currentDpsContract = new DpsContract();
    this.currentDpsContract.id = this.contractId;
    this.currentDpsContract.customerVatNumber = this.VatNumber;
    this.currentDpsContract.personId = this.personid;
    this.currentDpsContract.workScheduleId = 0;
    this.currentDpsContract.locationId = this.locationSelectedName;
    this.currentDpsContract.positionId = this.positionSelectedId;
    this.currentDpsContract.parentContractId = 0;
    this.currentDpsContract.bsContractId = 0;
    this.currentDpsContract.timeSheet = new TimeSheet();
    this.currentDpsContract.contract = new Contract();

    this.logger.log('createCurrentDpsContract call getDateString selectedStartDate :: ', this.selectedStartDate);
    this.currentDpsContract.contract.startDate = this.getDateString(this.selectedStartDate);
    this.logger.log('createCurrentDpsContract call getDateString selectedEndDate :: ', this.selectedEndDate);
    this.currentDpsContract.contract.endDate = this.getDateString(this.selectedEndDate);

    this.currentDpsContract.contract.workSchedule = null;
    this.currentDpsContract.contract.position = null;
    this.currentDpsContract.contract.statute = new Statute();
    this.currentDpsContract.contract.status = ContractStatus.Active;
    this.currentDpsContract.contract.cancelReason = '';
    this.currentDpsContract.contract.contractReason = this.contractReasonSelectedName;

    this.logger.log('createCurrentDpsContract  :: ', this.currentDpsContract);

    this.getSelectedWeekDays();

  }

  loadContract(vatNumber: string, cid: string) {
    this.showSpinner();
    this.contractService.getContractByVatNoAndId(vatNumber, cid).subscribe(response => {
      this.currentDpsContract = response;
      this.logger.log('loadContract :: ', response);

      if (this.mode !== 'extend') {
        this.selectedStartDate = new Date(response.contract.startDate);
        this.selectedStartYear = this.selectedStartDate.getFullYear();
        this.selectedStartMonth = this.selectedStartDate.getMonth();
        this.selectedStartDay = this.selectedStartDate.getDate();
        this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;

        this.selectedEndDate = new Date(response.contract.endDate);
        this.selectedEndYear = this.selectedEndDate.getFullYear();
        this.selectedEndMonth = this.selectedEndDate.getMonth();
        this.selectedEndDay = this.selectedEndDate.getDate();
        this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
        this.isApproved = response.approved;
      } else {
        this.selectedStartDate = new Date(this.allowedStartDate);
        this.selectedStartYear = this.allowedStartYear;
        this.selectedStartMonth = this.allowedStartMonth;
        this.selectedStartDay = this.allowedStartDay;
        this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;

        this.selectedEndDate = new Date(this.allowedEndDate);
        this.selectedEndYear = this.allowedEndYear;
        this.selectedEndMonth = this.allowedEndMonth;
        this.selectedEndDay = this.allowedEndDay;
        this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;

        this.currentDpsContract.parentContractId = this.currentDpsContract.id;
        this.contractId = 0;
        this.currentDpsContract.id = 0;
        this.currentDpsContract.contract.startDate = this.getDateString(this.selectedStartDate);
        this.currentDpsContract.contract.endDate = this.getDateString(this.selectedEndDate);
      }

      this.positionSelectedId = response.positionId;
      this.locationSelectedName = response.locationId;
      this.workScheduleSelected = response.workScheduleId;
      this.positionSelectedName = response.contract.position.name;
      this.logger.log('positionSelectedName 4 ::' + this.positionSelectedName);

      this.contractReasonSelectedName = response.contract.contractReason;

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }

      this.getSelectedWeekDays();

      // const selectedposition: DpsPostion = this.getPosition();
      // this.logger.log('loadContract Position :: ', selectedposition);

      this.logger.log('SetMode edit contract - this.selectedStartDate  :: ' + this.mode, this.selectedStartDate);
      this.logger.log('SetMode edit contract - this.selectedEndDate  :: ' + this.mode, this.selectedEndDate);

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }
      this.logger.log('loadPerson currentDpsContract  ', this.currentDpsContract);
      this.hideSpinner();
    }, error => this.errorHandle(error));
  }

  getSelectedWeekDays() {
    this.logger.log('getSelectedWeekDays()');
    let selectedWeekDay = 0;
    let loopDate: Date;
    this.selectedWeekDays = [];

    loopDate = new Date(this.selectedStartDate);
    let i = 0;
    this.isSelectedWeeksVaild = true;
    this.isSelectedWeeksVaildErrorMsg = '';

    while (loopDate.getDate() <= this.selectedEndDate.getDate() && i < 9) {
      i += 1;
      this.logger.log('loopDate(' + i + ') :: (' + this.selectedEndDate + ')=> ' + loopDate);
      loopDate.setDate(loopDate.getDate() + 1);
      selectedWeekDay = loopDate.getDay() - 1;

      if (selectedWeekDay === -1) {
        selectedWeekDay = 6;
      } else if (selectedWeekDay === 0) {
        selectedWeekDay = 7;
      }

      this.logger.log('contractWorkingDates', this.contractWorkingDates);

      // Checking the selected dates already has the contract or not
      if ((this.contractWorkingDates.indexOf(selectedWeekDay) > -1)) { // || this.contractWorkingDates.length === 0
        this.isSelectedWeeksVaild = false;
        this.isSelectedWeeksVaildErrorMsg = 'Geselecteerde weekdagen zijn niet toegestaan of deze weekdagen hebben al een contract.';
      } else {
        this.logger.log('getSelectedWeekDays in after contractWorkingDates');
        this.selectedWeekDays.push(selectedWeekDay);
      }
    }
    this.logger.log('getSelectedWeekDays selectedWeekDays', this.selectedWeekDays);
    this.onWorkScheduleChange(this.workScheduleSelected);
  }


  onPrintContractClick() {
    this.showSpinner();
    this.contractService.getPrintContractPDFFileURL(this.VatNumber, this.contractId).subscribe(
      printPDFSuccess => {
        this.hideSpinner();
        const FileURL = printPDFSuccess.fileUrl;
        saveAs(FileURL, 'PrintContract_' + this.VatNumber + '_' + this.contractId + '.pdf');
      },
      printContractPDFURLFailed => { this.ShowMessage('Fout! bij het afdrukken van het contract', ''); }
    );
  }

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.currentDpsContract;
      dialogConfig.ariaLabel = 'Arial Label Location Dialog';
      this.logger.log('dialogConfig.data :: ', dialogConfig.data);
      // const dialogRef = this.dialog.open(CancelContractComponent, dialogConfig);

      this.contractService.getContractByVatNoAndId(this.VatNumber, this.contractId.toString()).subscribe(response => {
        this.logger.log('loadContract :: ', response);

        dialogConfig.data = response;
        const dialogRef = this.dialog.open(CancelContractComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
          this.logger.log('The dialog was closed');
          this.currentDpsContract = result;
          this.logger.log('this.data ::', this.currentDpsContract);
          if (this.currentDpsContract !== null) {
            if (this.SelectedIndex > -1) {
              // maindatas Update Contract
              this.maindatas[this.SelectedIndex] = this.currentDpsContract;
              this.ShowMessage('Contract succesvol geannuleerd met volgende reden "'
                + this.currentDpsContract.contract.cancelReason + '".', '');
              this.dialogRef.close(null);
              // this.maindatas.splice(this.SelectedIndex, 1);
            }
            /*else {
              // maindatas Add Contract
              this.logger.log('this.data.id :: ', this.currentDpsContract.id);
              if (parseInt('0' + this.currentDpsContract.id, 0) > 0) {
                this.maindatas.push(this.currentDpsContract);
                this.logger.log('New Contract Added Successfully :: ', this.maindatas);
                // this.FilterTheArchive();
                this.ShowMessage('Contract "' + this.currentDpsContract.contract.name + '" is added successfully.', '');
              }
            }
            */
          }
        });
      }, error => this.errorHandle(error));
    } catch (e) { }
  }

  onApproveContractClick() {
    this.logger.log('onApproveContractClick :: ');
    this.showSpinner();
    this.contractService.getApproveContract(this.VatNumber, this.contractId).subscribe(
      approveContractSuccess => {
        this.logger.log('onApproveContractClick', approveContractSuccess);
        if (approveContractSuccess.accessStatus) {
          this.ShowMessage('Contract met succes goedgekeurd', '');
          // this.dialog.closeAll();
          this.isApproved = true;
        } else {
          this.isApproved = false;
          this.errorMsg = 'Fout! bij het goedkeuren van het contract. ' + approveContractSuccess.message;
          this.ShowMessage(this.errorMsg, ''); // Error! in approving the contract
        }
        this.hideSpinner();
      },
      approveContractFailed => {
        this.hideSpinner();
        this.ShowMessage('Fout! bij het goedkeuren van het contract', 'error'); // Error! in approving the contract
        this.logger.log('Approving the contract failed. ' + approveContractFailed);
      }
    );
  }

  onEnableEdit() { this.mode = 'edit'; this.SetMode(); }

  onCancelEdit() {
    if (this.mode === 'edit' || this.mode === 'extend') {
      this.mode = 'update';
      this.SetMode();
    } else { this.dialog.closeAll(); }
  }

  onExtented() { this.mode = 'extend'; this.SetMode(); }

  onCancelContractClick() {
    this.SelectedIndex = this.contractId;
    this.logger.log('onCancel Clicked Index :: ' + this.SelectedIndex);
    this.openDialog();
    return true;
  }

  onStartDateChange($event) {
    this.logger.log('start date $event', $event);
    if ($event !== undefined && $event !== null) {
      if (this.getDate($event).getDate() >= this.allowedStartDate.getDate()) {
        if (this.getDate($event).getDate() <= this.selectedEndDate.getDate()) {
          this.isStartDateVaild = true;
          this.isStartDateVaildErrorMsg = '';
          this.selectedStartDate = this.getDate($event);
          this.currentDpsContract.contract.startDate = this.getDateString(this.selectedStartDate); // this.createObjects();
          this.getSelectedWeekDays();
        } else {
          this.isStartDateVaild = false;
          this.isStartDateVaildErrorMsg = 'Kies de datum met in de geselecteerde week';
          this.ShowMessage(this.isStartDateVaildErrorMsg, '');
          this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
          // this.ContractForm.controls.calendarStartDate.value(this.selectedStartDate);
        }
      } else {
        this.isStartDateVaild = false;
        this.isStartDateVaildErrorMsg = 'Kies de datum met in de geselecteerde week';
        this.ShowMessage(this.isStartDateVaildErrorMsg, '');
        this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
        // this.ContractForm.controls.calendarStartDate.value(this.selectedStartDate);
      }
      // this.selectedStartDate = new Date($event.yearString + '-' +
      // this.formateZero($event.monthString) + '-' + this.formateZero($event.dayString));
    }
  }

  onEndDateChange($event) {
    this.logger.log('end date $event', $event);
    if ($event !== undefined && $event !== null) {
      if (this.getDate($event).getDate() <= this.allowedEndDate.getDate()) {
        if (this.getDate($event).getDate() >= this.selectedStartDate.getDate()) {
          this.isEndDateVaild = true;
          this.isEndDateVaildErrorMsg = '';
          this.selectedEndDate = this.getDate($event);
          this.currentDpsContract.contract.endDate = this.getDateString(this.selectedEndDate); // this.createObjects();
          this.getSelectedWeekDays();
        } else {
          this.isEndDateVaild = false;
          this.isEndDateVaildErrorMsg = 'Kies de datum met in de geselecteerde week';
          this.ShowMessage(this.isEndDateVaildErrorMsg, '');
          this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
          // this.ContractForm.controls.calendarEndDate.value(this.selectedEndDate);
        }
      } else {
        this.isEndDateVaild = false;
        this.isEndDateVaildErrorMsg = 'Kies de datum met in de geselecteerde week';
        this.ShowMessage(this.isEndDateVaildErrorMsg, '');
        this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
        // this.ContractForm.controls.calendarEndDate.value(this.selectedEndDate);
      }
    }
  }


  onPositionsChange(event) {
    this.positionSelectedName = event;
    this.logger.log('positionSelectedName 3 ::' + this.positionSelectedName);
    this.logger.log('onPositionsChange event :: ' + event); // option value will be sent as event
    if (event !== 0 && event !== undefined && event !== null && event !== '') {
      const dpsPositions = this.dpsPositionsData.filter(p => p.position.name === this.positionSelectedName);
      if (dpsPositions.length > 0) {
        this.positionSelectedId = dpsPositions[0].id;
        this.currentDpsContract.positionId = this.positionSelectedId;
        this.logger.log('onPositionsChange dpsPositionsData :: ', this.dpsPositionsData);
        this.logger.log('onPositionsChange dpsPositions by positionSelectedId :: '
          + this.positionSelectedId.toString(), dpsPositions[0]);
        this.currentDpsContract.contract.position = dpsPositions[0].position;
      } else {
        this.positionSelectedId = 0;
        this.currentDpsContract.positionId = this.positionSelectedId;
        this.currentDpsContract.contract.position = null;
      }

      this.logger.log('onPositionsChange positionSelectedId :: ' + this.positionSelectedId);
      this.logger.log('onPositionsChange this.positionSelectedId :: ' + this.positionSelectedId); // option value will be sent as event
    }

  }

  onReasonChange(event) {
    this.contractReasonSelectedName = event;
    this.currentDpsContract.contract.contractReason = this.contractReasonSelectedName;
    this.logger.log('onReasonChange this.contractReasonSelectedName ::' + this.contractReasonSelectedName);
    // option value will be sent as event
  }

  onWorkScheduleChange(event) {
    try {
      this.logger.log('onWorkScheduleChange event :: ' + event); // option value will be sent as event

      if (event !== 0 && event !== undefined && event !== null && event !== '') {
        this.workScheduleSelected = event;
        this.currentDpsContract.workScheduleId = this.workScheduleSelected;
        this.logger.log('onWorkScheduleChange  dpsWorkSchedulesData :: ', this.dpsWorkSchedulesData);
        const dpsWorkSchedules = this.dpsWorkSchedulesData.filter(w => w.id === parseInt(this.workScheduleSelected, 0));
        this.logger.log('onWorkScheduleChange  workScheduleSelected  :: ' + this.workScheduleSelected, dpsWorkSchedules[0]);
        const workScheduleInit: WorkSchedule = dpsWorkSchedules[0].workSchedule;
        const workSchedule = new WorkSchedule();
        this.logger.log('onWorkScheduleChange  workScheduleInit :: ', workScheduleInit);
        workSchedule.workDays = workScheduleInit.workDays.filter(wd => {
          this.logger.log('onWorkScheduleChange  workScheduleInit.workDays:: ', wd);
          let workDaysWithworkHoursFound = false;
          if (wd.workTimes.length > 0) {
            let timeCount = 0;
            wd.workTimes.forEach(wt => {
              this.logger.log('onWorkScheduleChange  workScheduleInit.workDays.workTimes[' + timeCount + '] :: ', workScheduleInit);
              if (wt.startTime !== '00:00' || wt.endTime !== '00:00') { workDaysWithworkHoursFound = true; }
              timeCount += 1;
            });
          }
          return this.selectedWeekDays.includes(wd.dayOfWeek) && workDaysWithworkHoursFound;
        });

        this.logger.log('onWorkScheduleChange  workScheduleInit workSchedule.workDays :: ', workSchedule.workDays);

        if (workSchedule.workDays.length < 1) {
          if (this.workScheduleSelected !== null && this.workScheduleSelected !== undefined && this.workScheduleSelected !== '') {
            this.isSelectedDateDoesNotHaveWork = false;
            this.isSelectedDateDoesNotHaveWorkErrorMsg = 'Werkschema heeft geen werkdagen voor de geselecteerde datums';
          } else {
            this.isWorkScheduleVaild = false;
            this.isWorkScheduleVaildErrorMsg = 'Selecteer het juiste Werkrooster';
          }
        } else {
          this.isWorkScheduleVaild = true;
          this.isWorkScheduleVaildErrorMsg = '';
          this.isSelectedDateDoesNotHaveWork = true;
          this.isSelectedDateDoesNotHaveWorkErrorMsg = ''; // 'Werkschema heeft geen werkdagen voor de geselecteerde datums';
        }
        this.currentDpsContract.contract.workSchedule = workSchedule;
        this.logger.log('onWorkScheduleChange  workSchedule :: ', workSchedule);
      }
    } catch (e) {
      alert(e.message);
    }
  }

  onLocationChange(event) {
    this.logger.log('onLocationChange event :: ' + event); // option value will be sent as event
    this.locationSelectedName = event;
    this.currentDpsContract.locationId = this.locationSelectedName;
  }

  onCreateOrUpdateContractClick() {
    this.logger.log('onCreateOrUpdateContractClick :: ', this.currentDpsContract);
    // Checking for the Selected Date is Vaild , Selected Dates Has Working Days, 
    // WorkSchedule is Selected or not  and Location is Selected or not
    if (this.isStartDateVaild && this.isEndDateVaild && this.isSelectedWeeksVaild &&
      this.isSelectedDateDoesNotHaveWork && this.isWorkScheduleVaild && this.isLocationVaild) {
      // Checking the Form is Vaild or not
      if (this.ContractForm.valid) {
        if (this.currentDpsContract !== undefined && this.currentDpsContract !== null) {
          if (this.currentDpsContract.positionId > 0) {
            if (this.currentDpsContract.workScheduleId > 0) {
              if (this.currentDpsContract.locationId > 0) {
                if (this.mode === 'edit') {
                  this.showSpinner();
                  this.contractService.updateContract(this.currentDpsContract).subscribe(res => {
                    this.currentDpsContract = res.body;
                    this.ShowMessage('Contract succesvol opgeslagen', '');
                    this.dialogRef.close(this.currentDpsContract);
                    this.hideSpinner();
                  }, (err: HttpErrorResponse) => this.errorHandle(err));
                } else {
                  console.log('in 9');
                  this.showSpinner();
                  this.contractService.createContract(this.currentDpsContract).subscribe(res => {
                    this.currentDpsContract = res.body;
                    this.ShowMessage('Contract succesvol opgeslagen', '');
                    this.dialogRef.close(this.currentDpsContract);
                    this.hideSpinner();
                  }, (err: HttpErrorResponse) => this.errorHandle(err));
                }
              } else { this.ShowMessage('Selecteer alstublieft Plaats', ''); }
            } else { this.ShowMessage('Selecteer alstublieft werkschema', ''); }
          } else { this.ShowMessage('Selecteer alstublieft Fuunctie', ''); }
        } else { this.ShowMessage('Contract is niet gedefinieerd', ''); }
      } else {
        this.ShowMessageCustom('Error...', 'Formulier is niet geldig', '');
      }
    } else {
      this.logger.log('Date is Not Vaild or Work Schedule Not Vaild');
      this.logger.log(this.isStartDateVaild + ',' + this.isEndDateVaild + ',' + this.isSelectedDateDoesNotHaveWork + ',' +
        this.isSelectedWeeksVaild + ',' + this.isWorkScheduleVaild + ',' + this.isLocationVaild);
      this.logger.log(this.isStartDateVaildErrorMsg, this.isEndDateVaildErrorMsg, this.isSelectedWeeksVaildErrorMsg);
      this.logger.log(this.isSelectedDateDoesNotHaveWorkErrorMsg, this.isWorkScheduleVaildErrorMsg, this.isLocationVaildErrorMsg);
      let errormsgnew = '';
      errormsgnew = this.getErrorMsg(errormsgnew, this.isStartDateVaildErrorMsg);
      errormsgnew = this.getErrorMsg(errormsgnew, this.isEndDateVaildErrorMsg);
      errormsgnew = this.getErrorMsg(errormsgnew, this.isSelectedWeeksVaildErrorMsg);
      errormsgnew = this.getErrorMsg(errormsgnew, this.isSelectedDateDoesNotHaveWorkErrorMsg);
      errormsgnew = this.getErrorMsg(errormsgnew, this.isWorkScheduleVaildErrorMsg);
      errormsgnew = this.getErrorMsg(errormsgnew, this.isLocationVaildErrorMsg);
      this.ShowMessageCustom('Error...', errormsgnew);
    }
  }

  getErrorMsg(errormsgnew, AddMsg) {
    if (errormsgnew !== '' && errormsgnew !== undefined && errormsgnew !== null) {
      if (AddMsg !== '' && AddMsg !== undefined && AddMsg !== null) { return errormsgnew + '\n' + AddMsg; } else { return errormsgnew; }
    } else { if (AddMsg !== '' && AddMsg !== undefined && AddMsg !== null) { return AddMsg; } else { return ''; } }
  }

  errorHandle(err: any) {
    if (err !== null) {
      this.hideSpinner();
      try {
        if (err.error instanceof Error) {
          this.ShowMessageCustom('Error...', err.error.message);
          this.logger.log(this.componentname + ' Error occured=' + err.error.message);
        } else {
          this.ShowMessageCustom('Error...', JSON.stringify(err.error));
          this.logger.log(this.componentname + ' response code=' + err.status);
          this.logger.log(this.componentname + ' response body=', err.error);
        }
      } catch (e) {
        this.errorMsg = err;
        this.ShowMessageCustom('Error...', JSON.stringify(err));
        this.logger.log(this.componentname + ' Error ', err);
      }
    }
  }

}

/*
public allowedExtentedStartDate: Date;
public allowedExtentedEndDate: Date;

public allowedExtentedStartYear: any;
public allowedExtentedStartMonth: any;
public allowedExtentedStartDay: any;

public allowedExtentedEndYear: any;
public allowedExtentedEndMonth: any;
public allowedExtentedEndDay: any;
*/


/*
} else if (this.mode === 'extend') {

  this.logger.log('this.selectedStartDate 2 before', this.selectedStartDate);
  this.selectedStartDate = new Date(this.allowedExtentedStartDate);
  this.logger.log('this.selectedStartDate 2 after', this.selectedStartDate);
  this.selectedStartYear = this.allowedExtentedStartYear;
  this.selectedStartMonth = this.allowedExtentedStartMonth;
  this.selectedStartDay = this.allowedExtentedStartDay;

  this.logger.log('this.selectedEndDate 2 before', this.selectedEndDate);
  this.selectedEndDate = new Date(this.allowedExtentedEndDate);
  this.logger.log('this.selectedEndDate 2 after', this.selectedEndDate);
  this.selectedEndYear = this.allowedExtentedEndYear;
  this.selectedEndMonth = this.allowedExtentedEndMonth;
  this.selectedEndDay = this.allowedExtentedEndDay;

  this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
  this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;

  this.logger.log('SetMode extend - calendar data=' + this.calendarData);
  this.logger.log('SetMode extend - calendarDataNew=' + this.calendarDataNew);
  this.logger.log('SetMode extend - this.selectedStartDate  :: ' + mode, this.selectedStartDate);
  this.logger.log('SetMode extend - this.selectedEndDate  :: ' + mode, this.selectedEndDate);

  this.createCurrentDpsContract();

  if (this.selectedStartYear === this.selectedEndYear) {
    this.calendaryearDisableStatus = true;
  } else { this.calendaryearDisableStatus = false; }

  if (this.selectedStartMonth === this.selectedEndMonth) {
    this.calendarmonthDisableStatus = true;
  } else { this.calendarmonthDisableStatus = false; }
*/
    // } else {



    // setDatesRanges
/*
this.allowedExtentedStartDate = new Date(this.allowedEndDate);
this.allowedExtentedStartDate.setDate(this.allowedExtentedStartDate.getDate() + 1);
this.allowedExtentedStartYear = this.allowedExtentedStartDate.getFullYear();
this.allowedExtentedStartMonth = this.allowedExtentedStartDate.getMonth();
this.allowedExtentedStartDay = this.allowedExtentedStartDate.getDate();

this.allowedExtentedEndDate = new Date(this.allowedEndDate);
this.allowedExtentedEndDate.setDate(this.allowedExtentedEndDate.getDate() + 7);
this.allowedExtentedEndYear = this.allowedExtentedEndDate.getFullYear();
this.allowedExtentedEndMonth = this.allowedExtentedEndDate.getMonth();
this.allowedExtentedEndDay = this.allowedEndDate.getDate();

this.logger.log('setDatesRanges allowedExtentedStartDate :: ', this.allowedExtentedStartDate);
this.logger.log('setDatesRanges allowedExtentedEndDate :: ', this.allowedExtentedEndDate);
*/



/*
} else if (this.mode === 'extend') {
this.loadContract(this.VatNumber, this.contractId.toString());
this.createCurrentDpsContract();
this.currentDpsContract.parentContractId = this.contractId;
this.contractId = 0;
this.currentDpsContract.id = 0;
this.logger.log('SetMode edit contract - this.selectedStartDate  :: ' + this.mode, this.selectedStartDate);
this.logger.log('SetMode edit contract - this.selectedEndDate  :: ' + this.mode, this.selectedEndDate);

if (this.selectedStartYear === this.selectedEndYear) {
  this.calendaryearDisableStatus = true;
} else { this.calendaryearDisableStatus = false; }

if (this.selectedStartMonth === this.selectedEndMonth) {
  this.calendarmonthDisableStatus = true;
} else { this.calendarmonthDisableStatus = false; }
*/


/*
this.spinner.show('mySpinner', {
  type: 'line-scale-party', size: 'default', bdColor: 'rgba(255, 255, 255, .8)', color: 'rgba(227, 119, 25, 1)'
});
*/
