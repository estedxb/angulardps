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
import { CalendarComponent } from '../calendar/calendar.component';
import { emit } from 'cluster';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css']
})

export class CreateContractComponent implements OnInit {
  // @Output() public childEvent = new EventEmitter();

  ContractForm: FormGroup;
  public selectedWeekDays: number[] = [];
  public contractAllowedDates: number[] = [];
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
  public calendardayDisableStatus = null;
  public calendarmonthDisableStatus = null;
  public calendaryearDisableStatus = null;
  public showLoading = false;
  public mode = 'new';
  public maindatas = [];
  public dpsPositionsData: DpsPostion[] = [];
  public locationsData = [];
  public dpsWorkSchedulesData = [];
  public contractReasonDatas: ContractReason[] = [];

  public positionSelected: any;
  public locationSelected: any;
  public workScheduleSelected: any;
  public contractReasonSelected: any;

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

  public personid: string = '0';
  public contractId: number = 0;
  public SelectedIndex = -1;
  public positionSelectedId = 0;
  public calendarData: string;
  public calendarDataNew: string;
  public isStartDateVaild = true;
  public isEndDateVaild = true;
  public isSelectedDateDoesNotHaveWork = true;
  public isSelectedWeeksVaild = true;

  public isStartDateVaildErrorMsg = '';
  public isEndDateVaildErrorMsg = '';
  public isSelectedDateDoesNotHaveWorkErrorMsg = '';
  public isSelectedWeeksVaildErrorMsg = '';

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
    this.onPageInit();
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

  clearCtrl() { }

  formateZero(n) { return n > 9 ? n : '0' + n; }

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

  getCalanderDateObject(dt: Date) {
    this.logger.log('getCalanderDateObject :: ', dt);
    const returnDate = dt.getDate() + ' ' + this.monthNames[dt.getMonth()] + ' ' + dt.getFullYear();
    this.logger.log('getCalanderDateObject returnDate 3 :: ', returnDate);
    return returnDate;
  }

  onPageInit() {
    this.showLoading = true;

    this.logger.log('SelectedContract :: ', this.selectedContract);

    this.contractId = this.selectedContract.contractId;
    this.personid = this.selectedContract.personId;
    this.mode = this.selectedContract.mode;

    this.logger.log('Current Contract ID :: ' + this.contractId);
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

    this.setDatesRanges();
    this.getContractAllowedWeekDays(this.selectedContract.personContracts);
    this.LoadContractReason();
  }

  setDatesRanges() {

    this.logger.log('setDatesRanges selectedContract.startDate :: ', this.selectedContract.startDate);
    this.logger.log('setDatesRanges selectedContract.endDate :: ', this.selectedContract.endDate);

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

  }

  getContractAllowedWeekDays(dpsScheduleContracts: DpsScheduleContract[]) {
    try {
      let contractCount = 0;
      this.logger.log('getContractAllowedWeekDays dpsScheduleContracts ', dpsScheduleContracts);
      if (this.selectedContract.personContracts !== null) {
        dpsScheduleContracts.forEach(dpsScheduleContract => {
          contractCount += 1;
          if (dpsScheduleContract.customerContractId !== this.contractId.toString()) {
            if (dpsScheduleContract.workSchedule !== null) {
              dpsScheduleContract.workSchedule.workDays.forEach(workDay => {
                this.logger.log('getContractAllowedWeekDays workDay[' + workDay.dayOfWeek + '].workTimes', workDay.workTimes);
                let isWorkScheduleFound = false;
                if (workDay.workTimes !== null) {
                  workDay.workTimes.forEach(workTime => {
                    this.logger.log('getContractAllowedWeekDays work startTime ' + workTime.startTime + ' :: endTime ' + workTime.endTime);
                    if (!( // workTime.startTime === '00:00' && workTime.endTime === '00:00'
                      (parseInt(workTime.startTime.split(':')[0], 0) === 0 && parseInt(workTime.startTime.split(':')[1], 0) === 0) &&
                      (parseInt(workTime.endTime.split(':')[0], 0) === 0 && parseInt(workTime.endTime.split(':')[1], 0) === 0)
                    )) {
                      isWorkScheduleFound = true;
                      this.logger.log('getContractAllowedWeekDays isWorkScheduleFound = ' + isWorkScheduleFound);
                    } else {
                      this.logger.log('getContractAllowedWeekDays isWorkScheduleFound = False');
                    }
                  });
                }
                if (!isWorkScheduleFound) { this.contractAllowedDates.push(workDay.dayOfWeek); }
                this.logger.log('getContractAllowedWeekDays workDays loop end of' + workDay.dayOfWeek);
              });
            } else {
              if (this.selectedContract.personContracts.length === 1) { this.contractAllowedDates = [1, 2, 3, 4, 5, 6, 7]; }
              this.logger.log('getContractAllowedWeekDays this contract skiped because this is the selected contract');
            }
          }
        });
      } else {
        this.contractAllowedDates = [1, 2, 3, 4, 5, 6, 7];
        this.logger.log('getContractAllowedWeekDays this contract skiped because no contracts for selected days');
      }
      this.logger.log('getContractAllowedWeekDays contractAllowedDates for contractCount(' + contractCount + ')', this.contractAllowedDates);
    } catch (e) {
      this.ShowMessage(e.message, '');
      this.logger.log('getContractAllowedWeekDays Error! ', e.message);
    }
  }

  LoadContractReason() {
    this.logger.log('getContractReason ');
    this.contractService.getContractReason()
      .subscribe(contractReasons => {
        this.logger.log('LoadContractReason contractReasons', contractReasons);
        this.contractReasonDatas = contractReasons;
        this.getPositionsByVatNumber();
      }, error => this.errorMsg = error);
  }

  getPositionsByVatNumber() {
    this.dpsPositionsData = [];
    this.positionsService.getPositionsByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(response => {
      this.dpsPositionsData = response;
      this.logger.log('dpsPositionsData : ', this.dpsPositionsData);
      //this.ShowMessage('Contract Positions fetched successfully.', '');
      this.getLocationsByVatNumber();
    }, error => this.ShowMessage(error, 'error'));
  }

  getLocationsByVatNumber() {
    this.locationsData = [];
    this.locationsService.getLocationByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(response => {
      this.locationsData = response;
      this.getWorkscheduleByVatNumber();
      this.logger.log('locationsData Form Data ::', this.locationsData);
      //this.ShowMessage('locationsData fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  getWorkscheduleByVatNumber() {
    this.dpsWorkSchedulesData = [];
    this.workschedulesService.getWorkscheduleByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(response => {
      this.dpsWorkSchedulesData = response;

      if (this.personid !== null && this.personid !== undefined && this.personid !== '') {
        this.loadPerson(this.personid, this.VatNumber);
      }

      /*
            if (this.contractId !== null && this.contractId !== undefined && this.contractId !== 0) {
              this.SetMode('update');
            } else {
              this.SetMode('new');
            }
      */
      this.SetMode();

      this.logger.log('DpsWorkSchedulesData Form Data : ', this.dpsWorkSchedulesData);
      //this.ShowMessage('WorkSchedules fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  SetMode() {
    this.logger.log('SetMode Mode :: ' + this.mode);
    if (this.mode === 'update') {
      this.currentDpsContract.id = this.contractId;
      this.loadContract(this.VatNumber, this.contractId.toString());
      this.logger.log('SetMode update contract - this.selectedStartDate  :: ' + this.mode, this.selectedStartDate);
      this.logger.log('SetMode update contract - this.selectedEndDate  :: ' + this.mode, this.selectedEndDate);
    } else if (this.mode === 'edit') {
      this.logger.log('SetMode edit contract - this.selectedStartDate  :: ' + this.mode, this.selectedStartDate);
      this.logger.log('SetMode edit contract - this.selectedEndDate  :: ' + this.mode, this.selectedEndDate);

      if (this.selectedStartYear === this.selectedEndYear) {
        this.calendaryearDisableStatus = true;
      } else { this.calendaryearDisableStatus = false; }

      if (this.selectedStartMonth === this.selectedEndMonth) {
        this.calendarmonthDisableStatus = true;
      } else { this.calendarmonthDisableStatus = false; }

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
    } else {
      if (this.mode === 'extend') {
        this.currentDpsContract.parentContractId = this.currentDpsContract.id;
        this.currentDpsContract.id = 0;
      }
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
    this.currentDpsContract.locationId = 0;
    this.currentDpsContract.positionId = this.positionSelectedId;
    this.currentDpsContract.parentContractId = 0;
    this.currentDpsContract.bsContractId = 0;
    this.currentDpsContract.timeSheet = new TimeSheet();

    this.contract = new Contract();

    this.contract.startDate = this.getDateString(this.selectedStartDate);
    this.contract.endDate = this.getDateString(this.selectedEndDate);

    this.contract.workSchedule = null;
    this.contract.position = null;
    this.contract.statute = new Statute();
    this.contract.status = ContractStatus.Active;
    this.contract.cancelReason = '';
    this.contract.contractReason = this.contractReasonSelected;

    this.currentDpsContract.contract = this.contract;
    this.logger.log('createCurrentDpsContract  :: ', this.currentDpsContract);

    this.getSelectedWeekDays();

  }

  loadContract(vatNumber: string, cid: string) {
    this.contractService.getContractByVatNoAndId(vatNumber, cid).subscribe(response => {
      this.logger.log('loadContract :: ', response);

      this.currentDpsContract = response;

      this.logger.log('this.selectedStartDate 4 before', this.selectedStartDate);
      this.selectedStartDate = new Date(response.contract.startDate);
      this.logger.log('this.selectedStartDate 4 after', this.selectedStartDate);

      this.logger.log('this.selectedEndDate 4 before', this.selectedEndDate);
      this.selectedEndDate = new Date(response.contract.endDate);
      this.logger.log('this.selectedEndDate 4 after', this.selectedEndDate);


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

      this.getSelectedWeekDays();

      // const selectedposition: DpsPostion = this.getPosition();
      // this.logger.log('loadContract Position :: ', selectedposition);

    });
  }


  getSelectedWeekDays() {
    this.logger.log('getSelectedWeekDays()');
    let selectedWeekDay = 0;
    let loopDate: Date;
    this.selectedWeekDays = [];

    loopDate = new Date(this.selectedStartDate);
    let i = 0;
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

      this.logger.log('contractAllowedDates', this.contractAllowedDates);

      if ((this.contractAllowedDates.indexOf(selectedWeekDay) > -1) || this.contractAllowedDates.length === 0) {
        this.logger.log('getSelectedWeekDays in after contractAllowedDates');
        this.selectedWeekDays.push(selectedWeekDay);
      } else {
        this.isSelectedWeeksVaild = false;
        this.isSelectedWeeksVaildErrorMsg = 'Selected weekdays are not allowed or this weekdays are already has contract.';
      }

    }
    this.logger.log('getSelectedWeekDays selectedWeekDays', this.selectedWeekDays);
    this.onWorkScheduleChange(this.workScheduleSelected);
  }

  loadPerson(personid: string, vatNumber: string) {
    this.personService.getPersonBySSIDVatnumber(personid, vatNumber).subscribe(response => {
      this.logger.log('personid :: ', personid);
      this.logger.log('loadPerson :: ', response);
      this.ContractForm.controls.firstname.setValue(response.person.firstName);
      this.ContractForm.controls.lastname.setValue(response.person.lastName);
      this.currentDpsContract.contract.statute = response.statute;
    });
  }


  getErrorMsg(errormsgnew, AddMsg) {
    if (errormsgnew !== '' && errormsgnew !== undefined && errormsgnew !== null) {
      if (AddMsg !== '') { return errormsgnew + '/n' + AddMsg; } else { return errormsgnew; }
    } else { return AddMsg; }
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

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.currentDpsContract;
      dialogConfig.ariaLabel = 'Arial Label Location Dialog';
      this.logger.log('dialogConfig.data :: ', dialogConfig.data);
      const dialogRef = this.dialog.open(CancelContractComponent, dialogConfig);

      const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => {
        this.ShowMessage($event.MSG, $event.Action);
      });

      dialogRef.afterClosed().subscribe(result => {
        this.logger.log('The dialog was closed');

        this.currentDpsContract = result;
        this.logger.log('this.data ::', this.currentDpsContract);
        if (this.SelectedIndex > -1) {
          // maindatas Update Contract
          this.maindatas[this.SelectedIndex] = this.currentDpsContract;
          this.ShowMessage('cancelReason "' + this.currentDpsContract.contract.cancelReason + '" is updated successfully.', '');
        } else {
          // maindatas Add Contract
          this.logger.log('this.data.id :: ', this.currentDpsContract.id);
          if (parseInt('0' + this.currentDpsContract.id, 0) > 0) {
            this.maindatas.push(this.currentDpsContract);
            this.logger.log('New Contract Added Successfully :: ', this.maindatas);
            // this.FilterTheArchive();
            this.ShowMessage('Contract "' + this.currentDpsContract.contract.name + '" is added successfully.', '');
          }
        }

      });
    } catch (e) { }
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

  onEnableEdit() {
    this.mode = 'edit';
    this.SetMode();
  }

  onCancelEdit() {
    if (this.mode === 'edit' || this.mode === 'extend') {
      this.mode = 'update';
      this.SetMode();
    } else { this.dialog.closeAll(); }
  }

  onExtented() {
    this.mode = 'extend';
    this.SetMode();
  }

  onCancelContractClick() {
    this.SelectedIndex = this.contractId;
    this.logger.log('onCancel Clicked Index :: ' + this.SelectedIndex);
    this.openDialog();
    return true;
  }

  onStartDateChange($event) {
    this.logger.log('start date $event', $event);
    if ($event !== undefined && $event !== null) {
      this.logger.log('Start in 1');
      this.logger.log('onStartDateChange (this.getDate($event).getDate() >= this.allowedStartDate.getDate()) = ' +
        (this.getDate($event).getDate() >= this.allowedStartDate.getDate()),
        this.getDate($event).getDate(), this.allowedStartDate.getDate());
      if (this.getDate($event).getDate() >= this.allowedStartDate.getDate()) {
        this.logger.log('Start in 2');
        this.logger.log('onStartDateChange (this.getDate($event).getDate() <= this.selectedEndDate.getDate()) = ' +
          (this.getDate($event).getDate() <= this.selectedEndDate.getDate()),
          this.getDate($event).getDate(), this.selectedEndDate.getDate());
        if (this.getDate($event).getDate() <= this.selectedEndDate.getDate()) {
          this.logger.log('Start in 3');
          this.isStartDateVaild = true;
          this.isStartDateVaildErrorMsg = '';
          this.logger.log('this.selectedStartDate 1 before', this.selectedStartDate);
          this.selectedStartDate = this.getDate($event);
          this.logger.log('this.selectedStartDate 1 after', this.selectedStartDate);
          this.contract.startDate = this.getDateString(this.selectedStartDate); // this.createObjects();
          this.getSelectedWeekDays();
        } else {
          this.logger.log('Start out 3');
          this.isStartDateVaild = false;
          this.isStartDateVaildErrorMsg = 'Please choose the date with in the selected week';
          this.ShowMessage(this.isStartDateVaildErrorMsg, '');
          this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;
          // this.ContractForm.controls.calendarStartDate.value(this.selectedStartDate);
        }
      } else {
        this.logger.log('Start out 2');
        this.isStartDateVaild = false;
        this.isStartDateVaildErrorMsg = 'Please choose the date with in the selected week';
        this.ShowMessage(this.isStartDateVaildErrorMsg, '');
        this.calendarData = this.selectedStartDay + '/' + (this.selectedStartMonth + 1) + '/' + this.selectedStartYear;

        // this.ContractForm.controls.calendarStartDate.value(this.selectedStartDate);
      }

      // this.selectedStartDate = new Date($event.yearString + '-' +
      // this.formateZero($event.monthString) + '-' + this.formateZero($event.dayString));
    } else {
      this.logger.log('Start out 1', 'onStartDateChange change date is empty');
    }
  }

  onEndDateChange($event) {
    this.logger.log('end date $event', $event);
    if ($event !== undefined && $event !== null) {

      this.logger.log('End in 1');
      this.logger.log('onEndDateChange this.getDate($event) <= this.allowedEndDate = ' + (this.getDate($event).getDate() <=
        this.allowedEndDate.getDate()), this.getDate($event).getDate(), this.allowedEndDate.getDate());

      if (this.getDate($event).getDate() <= this.allowedEndDate.getDate()) {

        this.logger.log('End in 2');
        this.logger.log('onEndDateChange this.getDate($event) >= this.selectedStartDate) = ' + (this.getDate($event).getDate() >=
          this.selectedStartDate.getDate()), this.getDate($event).getDate(), this.selectedStartDate.getDate());

        if (this.getDate($event).getDate() >= this.selectedStartDate.getDate()) {

          this.logger.log('End in 3');
          this.isEndDateVaild = true;
          this.isEndDateVaildErrorMsg = '';
          this.logger.log('onEndDateChange this.selectedEndDate 1 before', this.selectedEndDate);
          this.selectedEndDate = this.getDate($event);
          this.logger.log('onEndDateChange this.selectedEndDate 1 after', this.selectedEndDate);
          this.contract.endDate = this.getDateString(this.selectedEndDate); // this.createObjects();
          this.getSelectedWeekDays();

        } else {

          this.logger.log('End out 3');
          this.isEndDateVaild = false;
          this.isEndDateVaildErrorMsg = 'Please choose the date with in the selected week';
          this.ShowMessage(this.isEndDateVaildErrorMsg, '');
          this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
          // this.ContractForm.controls.calendarEndDate.value(this.selectedEndDate);

        }
      } else {

        this.logger.log('End out 2');
        this.isEndDateVaild = false;
        this.isEndDateVaildErrorMsg = 'Please choose the date with in the selected week';
        this.ShowMessage(this.isEndDateVaildErrorMsg, '');
        this.calendarDataNew = this.selectedEndDay + '/' + (this.selectedEndMonth + 1) + '/' + this.selectedEndYear;
        // this.ContractForm.controls.calendarEndDate.value(this.selectedEndDate);

      }
    } else {

      this.logger.log('End out 1', 'onEndDateChange change date is empty');

    }
  }


  onPositionsChange(event) {
    this.positionSelected = event;
    this.logger.log('onPositionsChange event :: ' + event); // option value will be sent as event
    if (event !== 0 && event !== undefined && event !== null && event !== '') {
      const dpsPositions = this.dpsPositionsData.filter(p => p.position.name === this.positionSelected);
      if (dpsPositions.length > 0) {
        this.positionSelectedId = dpsPositions[0].id;
        this.currentDpsContract.positionId = this.positionSelectedId;
        this.logger.log('onPositionsChange dpsPositionsData :: ', this.dpsPositionsData);
        this.logger.log('onPositionsChange  dpsPositions by positionSelectedId :: '
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
    this.contractReasonSelected = event;
    this.currentDpsContract.contract.contractReason = this.contractReasonSelected;
    this.logger.log('onReasonChange this.contractReasonSelected ::' + this.contractReasonSelected); // option value will be sent as event
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
        this.currentDpsContract.contract.workSchedule = workSchedule;
        this.logger.log('onWorkScheduleChange  workSchedule :: ', workSchedule);
      }
    } catch (e) {
      alert(e.message);
    }
  }

  onLocationChange(event) {
    this.logger.log('onLocationSelected event :: ' + event); // option value will be sent as event
    this.locationSelected = event;
    this.currentDpsContract.locationId = this.locationSelected;
  }

  onCreateOrUpdateContractClick() {
    // this.createObjects();
    this.logger.log('currentDpsContract ::', this.currentDpsContract);
    if (this.isStartDateVaild && this.isEndDateVaild && this.isSelectedDateDoesNotHaveWork && this.isSelectedWeeksVaild) {
      if (this.ContractForm.valid) {
        if (this.currentDpsContract !== undefined && this.currentDpsContract !== null) {
          this.logger.log('Create Contract');

          if (this.currentDpsContract.positionId > 0) {
            if (this.currentDpsContract.workScheduleId > 0) {
              if (this.currentDpsContract.locationId > 0) {
                this.contractService.createContract(this.currentDpsContract).subscribe(
                  res => {
                    this.logger.log('  Contract Response :: ', res.body);
                    this.currentDpsContract = res.body;
                    this.ShowMessage('Contract succesvol opgeslagen', '');
                    this.dialogRef.close(this.currentDpsContract);
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
      errormsgnew = this.getErrorMsg(errormsgnew, this.isSelectedWeeksVaildErrorMsg);
      this.ShowMessage(errormsgnew, '');
    }
  }

}






