import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {
  DpsPerson, Person, SelectedContract, DpsSchedule, DpsSchedulePerson, WorkDays, DpsScheduleContract, LoginToken, WorkTimes,
} from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatTooltipModule, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';
import { CreateContractComponent } from './createcontract/createcontract.component';
import { PersonService } from '../../../shared/person.service';
import { LoggingService } from '../../../shared/logging.service';
import { environment } from '../../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { WorkSchedule } from '../../../shared/models';

@Component({
  selector: 'app-dashboardperson',
  templateUrl: './dashboard-person.component.html',
  styleUrls: ['./../dashboard.component.css']
})
export class DashboardPersonComponent implements OnInit {
  @Input() NotificationCount: number;
  public maindatas: DpsSchedulePerson[] = [];
  public datas: DpsSchedulePerson[] = [];
  public selectedPersondatas: DpsSchedulePerson;
  public selectedPersonContracts: DpsScheduleContract[] = [];
  public data: any;
  public filterByName: string = '';
  public currentPage = '';
  public Id = '';
  public SelectedIndex = 0;
  public errorMsg;
  public dpsLoginToken: LoginToken = new LoginToken();
  public loginaccessToken = '';
  public vatNumber: string;
  public startDate: Date;
  public endDate: Date;
  public WeekDiff = 0;
  public SelectedDates = '';
  public SelectedMonday = '';
  public SelectedTuesday = '';
  public SelectedWednesday = '';
  public SelectedThursday = '';
  public SelectedFriday = '';
  public SelectedSaturday = '';
  public SelectedSunday = '';
  public ShowMorningDiff = environment.MorningStart;
  public ShowNightDiff = 24 - environment.EveningingEnd;
  public CellWidth = 120;
  public RollOverContract = 0;
  public allowCreateContract = false;
  // public TimeConverterToPx = 0.09375;

  public TimeConverterToPx = this.CellWidth / ((24 - this.ShowMorningDiff - this.ShowNightDiff) * 60);

  public currentState = 'initial';

  // tslint:disable-next-line: max-line-length
  constructor(
    private personService: PersonService, private route: ActivatedRoute, private logger: LoggingService,
    private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar, private elRef: ElementRef) { }

  ngOnInit() { this.onPageInit(); }

  changeState() { this.currentState = this.currentState === 'initial' ? 'final' : 'initial'; }

  onPageInit() {
    this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
    this.vatNumber = this.dpsLoginToken.customerVatNumber;
    this.loginaccessToken = this.dpsLoginToken.accessToken;
    this.SelectedDates = this.getSelectedDates();
    this.logger.log('onPageInit SelectedDates :: ' + this.SelectedDates);
    const localstartDate = this.startDate.getFullYear() + '-' + this.formateZero(this.startDate.getMonth() + 1)
      + '-' + this.formateZero(this.startDate.getDate());
    const localendDate = this.endDate.getFullYear() + '-' + this.formateZero(this.endDate.getMonth() + 1)
      + '-' + this.formateZero(this.endDate.getDate());

    this.logger.log('onPageInit startDate :: ' + this.startDate + ' :: this.startDate.getDate() :: ' + this.startDate.getDate());
    this.logger.log('onPageInit endDate :: ' + this.endDate);
    this.logger.log('onPageInit getDpsScheduleByVatNumber(' + this.vatNumber + ', ' + localstartDate + ', ' + localendDate);

    this.personService.getDpsScheduleByVatNumber(this.vatNumber, localstartDate, localendDate)
      .subscribe(dpsSchedule => {
        this.logger.log('onPageInit getDpsScheduleByVatNumber in DashboardPersonComponent ::', dpsSchedule);
        this.allowCreateContract = dpsSchedule.allowCreateContract;
        this.maindatas = dpsSchedule.persons;
        // this.datas = this.maindatas;
        this.filterScheduleByName();
        this.logger.log('onPageInit maindatas ::', this.maindatas);
        this.errorMsg = '';
      }, error => {
        this.logger.log('onPageInit error while getting  getDpsScheduleByVatNumber('
          + this.vatNumber + ',' + localstartDate + ',' + localendDate + ') ::', error);
        this.errorMsg = 'Fout bij het ophalen van de planning.';
      });

    this.logger.log('Dasboard-person onPageInit this.currentPage : ' + this.currentPage);
    if (this.currentPage === 'contract') {
      if (this.Id !== '' || this.Id !== undefined || this.Id !== null) {
        // openContract();
      }
    }
  }

  CheckWeekDayinWorkDays(weekdaynumber: number, wDays: WorkDays[]) {
    const FileteredWday = wDays.filter(wday => wday.dayOfWeek === weekdaynumber);
    // this.logger.log('CheckWeekDayinWorkDays(' + weekdaynumber + ', wDays) :: ',
    //  wDays, 'FileteredWday ::' + (FileteredWday.length > 0), FileteredWday);
    return FileteredWday.length > 0;
  }

  getWorkBarLeft(workday: WorkDays) {
    let WorkBarLeft = 0;
    if (workday !== null) {
      if (workday.workTimes !== null) {
        if (workday.workTimes.length > 0) {
          const SI: number = this.getStartTimeIndex(workday);
          WorkBarLeft = ((parseInt(workday.workTimes[SI].startTime.split(':')[0], 0) * 60) +
            (parseInt(workday.workTimes[SI].startTime.split(':')[1], 0)) - ((this.ShowMorningDiff + this.ShowNightDiff) / 2 * 60)) * this.TimeConverterToPx;
          // this.logger.log('WorkBarLeft :: ' + WorkBarLeft, WorkDays);
        }
      }
    }
    return WorkBarLeft;
  }

  getWorkBarWidth(workday: WorkDays) {
    let workBarWidth = 0;
    if (workday !== null) {
      if (workday.workTimes !== null) {
        if (workday.workTimes.length > 0) {
          const SI: number = this.getStartTimeIndex(workday);
          const EI: number = this.getEndTimeIndex(workday);
          workBarWidth = (
            ((parseInt(workday.workTimes[EI].endTime.split(':')[0], 0) * 60) + parseInt(workday.workTimes[EI].endTime.split(':')[1], 0)) -
            ((parseInt(workday.workTimes[SI].startTime.split(':')[0], 0) * 60) + parseInt(workday.workTimes[SI].startTime.split(':')[1], 0))
          ) * this.TimeConverterToPx;
          // this.logger.log('WorkBarWidth :: ' + workBarWidth, WorkDays);
        }
      }
    }
    return workBarWidth;
  }

  getWorkBarTime(workday: WorkDays) {
    let workBarTime = '';
    if (workday !== null) {
      if (workday.workTimes !== null) {
        if (workday.workTimes.length > 0) {
          const SI: number = this.getStartTimeIndex(workday);
          const EI: number = this.getEndTimeIndex(workday);
          workBarTime = workday.workTimes[SI].startTime + ' - ' + workday.workTimes[EI].endTime;
          // this.logger.log('workBarTime :: ' + workBarTime, WorkDays);
        }
      }
    }
    return workBarTime;
  }

  getStartTimeIndex(workday: WorkDays) {
    let idx = -1;
    let i = 0;
    while (workday.workTimes.length > i && idx < 0) {
      if (workday.workTimes[i].startTime !== '00:00' && workday.workTimes[i].endTime !== '00:00') { idx = i; break; }
      i += 1;
    }
    // this.logger.log('getStartTimeIndex idx = ' + idx, workday);
    if (idx === -1) { idx = 0; }
    return idx;
  }

  getEndTimeIndex(workday: WorkDays) {
    let idx = -1;
    let i = workday.workTimes.length;
    while (i > 0) {  // || idx < 0
      i -= 1;
      if (workday.workTimes[i].startTime !== '00:00' && workday.workTimes[i].endTime !== '00:00') { idx = i; break; }
    }
    // this.logger.log('getEndTimeIndex idx = ' + idx, workday);
    if (idx === -1) { idx = workday.workTimes.length - 1; }
    return idx;
  }

  getContractButtonLeft(workDays: WorkDays[], buttonCount: number) {
    // (contract.workSchedule.workDays[0].dayOfWeek=== 1 ? 0 : ((contract.workSchedule.workDays[0].dayOfWeek -1) * CellWidth )) - (contract.workSchedule.workDays.length > 1 ? 0 : (CellWidth/2))
    let buttonLeft = 0;
    if (workDays[0].dayOfWeek === 1) {
      if (buttonCount > 1 && workDays.length === 1) {
        buttonLeft = -(this.CellWidth / 2);
      } else {
        buttonLeft = 0;
      }
    } else {
      if (buttonCount === 1) {
        buttonLeft = ((workDays[0].dayOfWeek - 1) * this.CellWidth);
      } else {
        buttonLeft = ((workDays[0].dayOfWeek - 1) * this.CellWidth) - (workDays.length > 1 ? 0 : (this.CellWidth / 2));
      }
    }
    return buttonLeft;
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

  onContractOver(contractId: number, state: boolean, ref: ElementRef) {
    if (state) {
      this.RollOverContract = contractId;
    } else {
      this.RollOverContract = 0;
    }
  }

  onPersonKeyup(value) {
    this.filterByName = value;
    this.filterScheduleByName();
  }

  filterScheduleByName() {
    try {
      this.datas = [];
      if (this.maindatas !== null && this.maindatas !== undefined) {
        if (this.maindatas.length > 0) {
          console.log('this.maindatas', this.maindatas);
          this.datas = this.maindatas
            .map(pers => { if (pers.personName.toLowerCase().indexOf(this.filterByName.toLowerCase()) > -1) { return pers; } });
          console.log('this.datas', this.datas);
        } else { this.datas = this.maindatas; }
      } else { this.datas = this.maindatas; }
    } catch (e) { this.logger.log('dashboardperson onPersonKeyup Error ! ' + e.message); }
  }

  addWeek() { this.WeekDiff += 1; this.onPageInit(); }

  minusWeek() { this.WeekDiff -= 1; this.onPageInit(); }

  formateZero(n) { return n > 9 ? n : '0' + n; }

  getSelectedDates() {
    const curr = new Date();

    const adddays: number = this.WeekDiff * 7;
    let adjustDaysForWeekStartDate = - 1;

    this.logger.log('Current Date :: ' + curr);
    this.logger.log('Current Day :: ' + curr.getUTCDay());
    this.logger.log('adddays :: ' + adddays);

    if (curr.getUTCDay() === 0) {
      adjustDaysForWeekStartDate = adjustDaysForWeekStartDate + 7 + curr.getUTCDay();
    } else { adjustDaysForWeekStartDate = adjustDaysForWeekStartDate + curr.getUTCDay(); }

    this.logger.log('adjustDaysForWeekStartDate :: ' + adjustDaysForWeekStartDate);

    curr.setDate(curr.getUTCDate() - adjustDaysForWeekStartDate);

    this.logger.log('Start Date :: ' + curr);

    curr.setDate(curr.getUTCDate() + adddays);
    const mon = new Date(curr);
    curr.setDate(curr.getUTCDate() + 1);
    const tue = new Date(curr);
    curr.setDate(curr.getUTCDate() + 1);
    const wed = new Date(curr);
    curr.setDate(curr.getUTCDate() + 1);
    const thu = new Date(curr);
    curr.setDate(curr.getUTCDate() + 1);
    const fri = new Date(curr);
    curr.setDate(curr.getUTCDate() + 1);
    const sat = new Date(curr);
    curr.setDate(curr.getUTCDate() + 1);
    const sun = new Date(curr);
    this.logger.log('Start End :: ' + curr);

    this.startDate = mon;
    this.endDate = sun;

    this.SelectedMonday = mon.getUTCDate().toString() + '/' + mon.getUTCMonth().toString();
    this.SelectedTuesday = tue.getUTCDate().toString() + '/' + tue.getUTCMonth().toString();
    this.SelectedWednesday = wed.getUTCDate().toString() + '/' + wed.getUTCMonth().toString();
    this.SelectedThursday = thu.getUTCDate().toString() + '/' + thu.getUTCMonth().toString();
    this.SelectedFriday = fri.getUTCDate().toString() + '/' + fri.getUTCMonth().toString();
    this.SelectedSaturday = sat.getUTCDate().toString() + '/' + sat.getUTCMonth().toString();
    this.SelectedSunday = sun.getUTCDate().toString() + '/' + sun.getUTCMonth().toString();

    // tslint:disable-next-line: max-line-length
    return this.formateZero(this.startDate.getUTCDate().toString()) + ' ' + this.getShortMonth(this.startDate) + (this.startDate.getUTCFullYear() !== this.endDate.getUTCFullYear() ? 'this.startDate.getUTCFullYear()' : '') + ' - ' + this.formateZero(this.endDate.getUTCDate().toString()) + ' ' + this.getShortMonth(this.endDate) + '. ' + this.endDate.getUTCFullYear();
  }
  getShortMonth(date) { return date.toLocaleString('nl-NL', { month: 'long' }); }

  openContractDialog(index, personid, contractid, personIsEnabled, personIsArchived, approved, mode): void {
    this.logger.log('openContractDialog(' + index + ',' + personid + ',' + contractid +
      ',' + personIsEnabled + ',' + personIsArchived + ',' + approved + ',' + mode + ')');
    // this.logger.log(this.startDate + ' and endDate :: ' + this.endDate);
    try {
      if (mode !== undefined && mode !== null && mode !== '') {
        if (mode === 'extend' || mode === 'new') {
          if (!this.allowCreateContract) {
            this.ShowMessage('Customer not allowed to create or extend contract.', '');
            return;
          } else if (!personIsEnabled || personIsArchived) {
            this.ShowMessage('Person is disabled or archived.', '');
            return;
          }
        }

        const selectedContract = new SelectedContract();
        selectedContract.personContracts = this.getSelectedPersonContracts(index, personid);

        selectedContract.contractId = contractid;
        selectedContract.personId = personid;
        selectedContract.mode = mode;
        selectedContract.allowCreateContract = this.allowCreateContract;
        selectedContract.approved = approved;
        selectedContract.personIsEnabled = personIsEnabled;
        selectedContract.personIsArchived = personIsArchived;

        this.logger.log('open Create Contract  startDate ::', this.startDate + ' and endDate :: ' + this.endDate);

        selectedContract.startDate = this.startDate;
        selectedContract.endDate = this.endDate;

        if (mode === 'extend') {
          selectedContract.startDate.setDate(selectedContract.startDate.getDate() + 7);
          selectedContract.endDate.setDate(selectedContract.endDate.getDate() + 7);
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '700px';
        dialogConfig.data = selectedContract;
        dialogConfig.ariaLabel = 'Arial Label Positions Dialog';

        const dialogRef = this.dialog.open(CreateContractComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
          this.logger.log('The dialog was closed');
          this.data = result;
          this.logger.log('this.data ::', this.data);
          this.onPageInit();
        });
      } else {
        this.ShowMessage('Error mode not selected.', '');
      }
    } catch (e) {
      alert('openContractDialog :: ' + e.message);
    }
  }



  getSelectedPersonContracts(index, personid) {
    this.selectedPersonContracts = [];
    try {
      this.logger.log('getSelectedPersonContracts(' + index + ',' + personid + ') ');
      if (this.datas.length > 0) {
        this.selectedPersondatas = this.datas[index]; // this.datas.map(pers => { if (pers.personId === personid) { return pers; } });
        if (this.selectedPersondatas !== null) {
          try {
            if (this.selectedPersondatas.contracts.length > 0) {
              this.selectedPersonContracts = this.selectedPersondatas.contracts;
            } else { this.selectedPersonContracts = []; }
          } catch (e) { this.selectedPersonContracts = []; }
        } else { this.selectedPersonContracts = []; }
      } else {
        try {
          if (this.datas[0].contracts.length > 0) {
            this.selectedPersonContracts = this.datas[0].contracts;
          } else { this.selectedPersonContracts = []; }
        } catch (e) { this.selectedPersonContracts = []; }
      }
      this.logger.log('getSelectedPersonContracts(' + personid + ') selectedPersonContracts :: ', this.selectedPersonContracts);

    } catch (e) { this.selectedPersonContracts = []; }

    return this.selectedPersonContracts;
  }

  OpenAddPersonURL() {
    this.router.navigate(['./person/add']); this.logger.log(this.constructor.name + ' - ' + 'Redirect... person/add');
  }
  OpenBulkContractURL() {
    this.router.navigate(['./bulkcontract']); this.logger.log(this.constructor.name + ' - ' + 'Redirect... ./bulkcontract');
  }
  OpenUpdatePerson(SSID: string) {
    this.router.navigate(['./person/' + SSID]); this.logger.log(this.constructor.name + ' - ' + 'Redirect... person/' + SSID);
  }
}




 //openContractDialog // dialogRef.afterClosed()
/*
if (this.SelectedIndex >= 0) {
  this.maindatas[this.SelectedIndex] = this.data;
  this.FilterTheArchive();
  this.ShowMessage('Positions "' + this.data.position.name + '" is updated successfully.', '');
} else {
  this.logger.log('this.data.id :: ', this.data.id);
  if (parseInt('0' + this.data.id, 0) > 0) {
    this.maindatas.push(this.data);
    this.logger.log(' new this.maindatas :: ', this.maindatas);
    this.FilterTheArchive();
    this.ShowMessage('Positions "' + this.data.position.name + '" is added successfully.', '');
  }
}
*/


    // onContractOver ...
    // console.log('onContractOver elRef :: ', this.elRef);
    // console.log('onContractOver offsetLeft :: ' + this.elRef.nativeElement.offsetLeft);
    // console.log('onContractOver offsetTop :: ' + this.elRef.nativeElement.offsetTop);
    // console.log('onContractOver(' + contractId.toString() + ',' + state + ')');
