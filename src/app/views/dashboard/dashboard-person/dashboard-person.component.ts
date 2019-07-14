import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {
  DpsPerson, Person, SelectedContract, DpsSchedule, DpsSchedulePerson, WorkDays, DpsScheduleContract, LoginToken, WorkTimes,
} from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog, MatDialogConfig, MatTooltipModule, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';
import { CreateContractComponent } from './createcontract/createcontract.component';
import { PersonService } from '../../../shared/person.service';
import { LoggingService } from '../../../shared/logging.service';
import { environment } from '../../../../environments/environment';
import { WorkSchedule } from '../../../shared/models';


@Component({
  selector: 'app-dashboardperson',
  templateUrl: './dashboard-person.component.html',
  styleUrls: ['./../dashboard.component.css']
})
export class DashboardPersonComponent implements OnInit {
  @Input() NotificationCount: number;
  public maindatasWithContracts: DpsSchedulePerson[] = [];
  public maindatasWithOutContracts: DpsSchedulePerson[] = [];
  public datasWithContracts: DpsSchedulePerson[] = [];
  public datasWithOutContracts: DpsSchedulePerson[] = [];
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
    private dialog: MatDialog, private router: Router, private elRef: ElementRef) { }

  ngOnInit() { this.onPageInit(); }

  changeState() { this.currentState = this.currentState === 'initial' ? 'final' : 'initial'; }

  onPageInit() {
    this.logger.showSpinner();
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
        this.maindatasWithContracts = dpsSchedule.persons.filter(p => p.contracts.length > 0);
        this.maindatasWithContracts.sort((p, b) => p.personName.localeCompare(b.personName));

        this.maindatasWithOutContracts = dpsSchedule.persons.filter(p => {
          if (p.contracts.length > 0) { return false; } else { return true; }
        });
        this.maindatasWithOutContracts.sort((p, b) => p.personName.localeCompare(b.personName));

        // this.datas = this.maindatasWithContracts;
        this.filterScheduleByName();
        this.filterScheduleByNameWO();
        this.logger.log('onPageInit maindatasWithContracts ::', this.maindatasWithContracts);
        this.errorMsg = '';
      }, error => {
        this.logger.hideSpinner();
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
    this.filterScheduleByNameWO();
  }

  filterScheduleByName() {
    try {
      this.datasWithContracts = [];
      console.log('filterScheduleByName this.maindatasWithContracts', this.maindatasWithContracts);
      if (this.maindatasWithContracts !== null && this.maindatasWithContracts !== undefined) {
        if (this.maindatasWithContracts.length > 0) {
          this.datasWithContracts = this.maindatasWithContracts.map(pers => {
            if (pers.personName.toLowerCase().indexOf(this.filterByName.toLowerCase()) > -1 && !pers.personIsArchived) { return pers; }
          });
        } else { this.datasWithContracts = this.maindatasWithContracts; }
      } else { this.datasWithContracts = this.maindatasWithContracts; }
      console.log('filterScheduleByName this.datasWithContracts', this.datasWithContracts);

    } catch (e) { this.logger.log('filterScheduleByName dashboardperson onPersonKeyup Error ! ' + e.message); }
    this.logger.hideSpinner();
  }


  filterScheduleByNameWO() {
    try {
      this.datasWithOutContracts = [];
      console.log('filterScheduleByNameWO this.maindatasWithOutContracts', this.maindatasWithOutContracts);
      if (this.maindatasWithOutContracts !== null && this.maindatasWithOutContracts !== undefined) {
        if (this.maindatasWithOutContracts.length > 0) {
          this.datasWithOutContracts = this.maindatasWithOutContracts.map(pers => {
            if (pers.personName.toLowerCase().indexOf(this.filterByName.toLowerCase()) > -1 && !pers.personIsArchived) { return pers; }
          });
        } else { this.datasWithOutContracts = this.maindatasWithOutContracts; }
      } else { this.datasWithOutContracts = this.maindatasWithOutContracts; }
      console.log('filterScheduleByNameWO this.datasWithOutContracts', this.datasWithOutContracts);

    } catch (e) { this.logger.log('filterScheduleByNameWO dashboardperson onPersonKeyup Error ! ' + e.message); }
    this.logger.hideSpinner();
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

    this.SelectedMonday = this.formateZero(mon.getUTCDate()).toString() + '/' + this.formateZero(mon.getUTCMonth() + 1).toString();
    this.SelectedTuesday = this.formateZero(tue.getUTCDate()).toString() + '/' + this.formateZero(tue.getUTCMonth() + 1).toString();
    this.SelectedWednesday = this.formateZero(wed.getUTCDate()).toString() + '/' + this.formateZero(wed.getUTCMonth() + 1).toString();
    this.SelectedThursday = this.formateZero(thu.getUTCDate()).toString() + '/' + this.formateZero(thu.getUTCMonth() + 1).toString();
    this.SelectedFriday = this.formateZero(fri.getUTCDate()).toString() + '/' + this.formateZero(fri.getUTCMonth() + 1).toString();
    this.SelectedSaturday = this.formateZero(sat.getUTCDate()).toString() + '/' + this.formateZero(sat.getUTCMonth() + 1).toString();
    this.SelectedSunday = this.formateZero(sun.getUTCDate()).toString() + '/' + this.formateZero(sun.getUTCMonth() + 1).toString();

    // tslint:disable-next-line: max-line-length
    return this.formateZero(this.startDate.getUTCDate().toString()) + ' ' + this.getShortMonth(this.startDate) + (this.startDate.getUTCFullYear() !== this.endDate.getUTCFullYear() ? ' ' + this.startDate.getUTCFullYear() : '') + ' - ' + this.formateZero(this.endDate.getUTCDate().toString()) + ' ' + this.getShortMonth(this.endDate) + ' ' + this.endDate.getUTCFullYear();
  }
  getShortMonth(date) { return date.toLocaleString('nl-NL', { month: 'short' }); }

  openContractDialog(index, personid, contractid, personIsEnabled, personIsArchived, approved, mode, persontype): void {
    this.logger.log('openContractDialog(' + index + ',' + personid + ',' + contractid +
      ',' + personIsEnabled + ',' + personIsArchived + ',' + approved + ',' + mode + ')');
    // this.logger.log(this.startDate + ' and endDate :: ' + this.endDate);
    try {
      if (mode !== undefined && mode !== null && mode !== '') {
        if (mode === 'extend' || mode === 'new') {
          if (!this.allowCreateContract) {
            this.logger.ShowMessage('Customer not allowed to create or extend contract.', '');
            return;
          } else if (!personIsEnabled || personIsArchived) {
            this.logger.ShowMessage('Person is disabled or archived.', '');
            return;
          }
        }

        const selectedContract = new SelectedContract();
        if (persontype === 'WO') {
          selectedContract.personContracts = this.getSelectedPersonContractsWO(index, personid);
        } else {
          selectedContract.personContracts = this.getSelectedPersonContracts(index, personid);
        }

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
        this.logger.ShowMessage('Error mode not selected.', '');
      }
    } catch (e) {
      alert('openContractDialog :: ' + e.message);
    }
  }

  getSelectedPersonContracts(index, personid) {
    this.selectedPersonContracts = [];
    try {
      this.logger.log('getSelectedPersonContracts(' + index + ',' + personid + ') ');
      if (this.datasWithContracts.length > 0) {
        this.selectedPersondatas = this.datasWithContracts[index];
        // this.datas.map(pers => { if (pers.personId === personid) { return pers; } });
        if (this.selectedPersondatas !== null) {
          try {
            if (this.selectedPersondatas.contracts.length > 0) {
              this.selectedPersonContracts = this.selectedPersondatas.contracts;
            } else { this.selectedPersonContracts = []; }
          } catch (e) { this.selectedPersonContracts = []; }
        } else { this.selectedPersonContracts = []; }
      } else {
        try {
          if (this.datasWithContracts[0].contracts.length > 0) {
            this.selectedPersonContracts = this.datasWithContracts[0].contracts;
          } else { this.selectedPersonContracts = []; }
        } catch (e) { this.selectedPersonContracts = []; }
      }
      this.logger.log('getSelectedPersonContracts(' + personid + ') selectedPersonContracts :: ', this.selectedPersonContracts);
    } catch (e) { this.selectedPersonContracts = []; }
    return this.selectedPersonContracts;
  }

  getSelectedPersonContractsWO(index, personid) {
    this.selectedPersonContracts = [];
    try {
      this.logger.log('getSelectedPersonContractsWO(' + index + ',' + personid + ') ');
      if (this.datasWithOutContracts.length > 0) {
        this.selectedPersondatas = this.datasWithOutContracts[index];
        // this.datas.map(pers => { if (pers.personId === personid) { return pers; } });
        if (this.selectedPersondatas !== null) {
          try {
            if (this.selectedPersondatas.contracts.length > 0) {
              this.selectedPersonContracts = this.selectedPersondatas.contracts;
            } else { this.selectedPersonContracts = []; }
          } catch (e) { this.selectedPersonContracts = []; }
        } else { this.selectedPersonContracts = []; }
      } else {
        try {
          if (this.datasWithOutContracts[0].contracts.length > 0) {
            this.selectedPersonContracts = this.datasWithOutContracts[0].contracts;
          } else { this.selectedPersonContracts = []; }
        } catch (e) { this.selectedPersonContracts = []; }
      }
      this.logger.log('getSelectedPersonContractsWO(' + personid + ') selectedPersonContracts :: ', this.selectedPersonContracts);
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


// openContractDialog // dialogRef.afterClosed()
/*
if (this.SelectedIndex >= 0) {
  this.maindatasWithContracts[this.SelectedIndex] = this.data;
  this.FilterTheArchive();
  this.logger.ShowMessage('Positions "' + this.data.position.name + '" is updated successfully.', '');
} else {
  this.logger.log('this.data.id :: ', this.data.id);
  if (parseInt('0' + this.data.id, 0) > 0) {
    this.maindatasWithContracts.push(this.data);
    this.logger.log(' new this.maindatasWithContracts :: ', this.maindatasWithContracts);
    this.FilterTheArchive();
    this.logger.ShowMessage('Positions "' + this.data.position.name + '" is added successfully.', '');
  }
}
*/


    // onContractOver ...
    // console.log('onContractOver elRef :: ', this.elRef);
    // console.log('onContractOver offsetLeft :: ' + this.elRef.nativeElement.offsetLeft);
    // console.log('onContractOver offsetTop :: ' + this.elRef.nativeElement.offsetTop);
    // console.log('onContractOver(' + contractId.toString() + ',' + state + ')');
