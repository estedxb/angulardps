import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DpsPerson, Person, SelectedContract, DpsSchedule, DpsSchedulePerson, WorkDays, DpsScheduleContract } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatTooltipModule } from '@angular/material';
import { CreateContractComponent } from '../../../componentcontrols/createcontract/createcontract.component';
import { PersonService } from '../../../shared/person.service';
import { LoggingService } from '../../../shared/logging.service';

@Component({
  selector: 'app-dashboardperson',
  templateUrl: './dashboard-person.component.html',
  styleUrls: ['./../dashboard.component.css']
})
export class DashboardPersonComponent implements OnInit {
  public maindatas: DpsSchedulePerson[] = [];
  public datas: DpsSchedulePerson[] = [];
  public selectedPersondatas: DpsSchedulePerson[] = [];
  public selectedPersonContracts: DpsScheduleContract[] = [];
  public data: any;
  public currentPage = '';
  public Id = '';
  public SelectedIndex = 0;
  public errorMsg;
  public loginaccessToken: string = localStorage.getItem('accesstoken');
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));
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
  public ShowMorningDiff = 6;
  public ShowNightDiff = 2;
  public CellWidth = 120;
  // public TimeConverterToPx = 0.09375;
  public TimeConverterToPx = this.CellWidth / ((24 - this.ShowMorningDiff - this.ShowNightDiff) * 60);
  // tslint:disable-next-line: max-line-length
  constructor(
    private personService: PersonService, private route: ActivatedRoute, private logger: LoggingService,
    private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.vatNumber = this.loginuserdetails.customerVatNumber;
    this.SelectedDates = this.getSelectedDates();
    const localstartDate = this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate();
    const localendDate = this.endDate.getFullYear() + '-' + (this.endDate.getMonth() + 1) + '-' + this.endDate.getDate();

    this.logger.log('onPageInit startDate :: ' + this.startDate + ' :: this.startDate.getDate() :: ' + this.startDate.getDate());
    this.logger.log('onPageInit endDate :: ' + this.endDate);
    this.logger.log('onPageInit getDpsScheduleByVatNumber(' + this.vatNumber + ', ' + localstartDate + ', ' + localendDate);

    this.personService.getDpsScheduleByVatNumber(this.vatNumber, localstartDate, localendDate)
      .subscribe(dpsSchedule => {
        this.logger.log('getDpsScheduleByVatNumber in DashboardPersonComponent ::', dpsSchedule);
        this.maindatas = dpsSchedule.persons;
        this.onPersonKeyup('');
        this.logger.log('maindatas ::', this.maindatas);
      }, error => this.errorMsg = error);

    this.logger.log('this.currentPage : ' + this.currentPage);
    if (this.currentPage === 'contract') {
      if (this.Id !== '' || this.Id !== undefined || this.Id !== null) {
        // openContract();
      }
    }
  }

  onPersonKeyup(value) {
    try {
      this.datas = [];
      if (this.maindatas !== null && this.maindatas !== undefined) {
        if (this.maindatas.length > 0) {
          this.datas = this.maindatas
            .map(pers => {
              if (pers.personName.toLowerCase().indexOf(value.toLowerCase()) > -1) { return pers; }
            });
        } else {
          this.datas = this.maindatas;
        }
      } else {
        this.datas = this.maindatas;
      }
    } catch (e) {
      this.logger.log('dashboardperson onPersonKeyup Error ! ' + e.message);
    }
  }

  addWeek() {
    this.WeekDiff += 1;
    this.onPageInit();
  }

  minusWeek() {
    this.WeekDiff -= 1;
    this.onPageInit();
  }

  getSelectedDates() {
    // const setdate = '2019-06-03';
    const curr = new Date();

    const adddays: number = this.WeekDiff * 7;
    let adjustDaysForWeekStartDate = - 1;

    this.logger.log('Current Date :: ' + curr);
    this.logger.log('Current Day :: ' + curr.getUTCDay());
    this.logger.log('adddays :: ' + adddays);

    if (curr.getUTCDay() === 0) {
      adjustDaysForWeekStartDate = adjustDaysForWeekStartDate + 7 + curr.getUTCDay();
    } else {
      adjustDaysForWeekStartDate = adjustDaysForWeekStartDate + curr.getUTCDay();
    }

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
    return this.startDate.getUTCDate().toString() + ' ' + this.getShortMonth(this.startDate) + ' - ' + this.endDate.getUTCDate().toString() + ' ' + this.getShortMonth(this.endDate) + '. ' + this.endDate.getUTCFullYear();
  }
  getShortMonth(date) { return date.toLocaleString('nl-NL', { month: 'long' }); }

  openContractDialog(personid, contractid): void {
    try {
      const selectedContract = new SelectedContract();
      selectedContract.personContracts = this.getSelectedPersonWorkDays(personid);
      selectedContract.contractId = contractid;
      selectedContract.personId = personid;
      this.logger.log('open Create Contract  startDate ::', this.startDate + ' and endDate :: ' + this.endDate);
      selectedContract.startDate = this.startDate;
      selectedContract.endDate = this.endDate;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = selectedContract;
      this.logger.log('selectedContract :: ', selectedContract);
      dialogConfig.ariaLabel = 'Arial Label Positions Dialog';

      const dialogRef = this.dialog.open(CreateContractComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        this.logger.log('The dialog was closed');
        this.data = result;
        this.logger.log('this.data ::', this.data);

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
      });

    } catch (e) { alert(e.message); }
  }

  getSelectedPersonWorkDays(personid) {
    this.logger.log('getSelectedPersonWorkDays(' + personid + ') ');
    this.selectedPersonContracts = [];
    if (this.maindatas.length > 0) {
      this.selectedPersondatas = this.maindatas.map(pers => { if (pers.personId === personid) { return pers; } });
      if (this.selectedPersondatas.length > 0) {
        this.selectedPersonContracts = this.selectedPersondatas[0].contracts;
      } else {
        this.selectedPersonContracts = null;
      }
    } else {
      this.selectedPersonContracts = this.maindatas[0].contracts;
    }
    this.logger.log('getSelectedPersonWorkDays(' + personid + ') selectedPersonContracts :: ', this.selectedPersonContracts);
    return this.selectedPersonContracts;
  }

  OpenAddPersonURL() {
    this.router.navigate(['./person/add']);
  }
  OpenBulkContractURL() {
    this.router.navigate(['./bulkcontract']);
  }
  OpenUpdatePerson(SSID: string) {
    this.router.navigate(['./person/' + SSID]);
  }

}
