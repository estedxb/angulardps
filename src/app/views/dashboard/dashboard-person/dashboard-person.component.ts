import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DpsPerson, Person, SelectedContract } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatTooltipModule } from '@angular/material';
import { CreateContractComponent } from '../../../componentcontrols/createcontract/createcontract.component';
import { PersonService } from '../../../shared/person.service';

@Component({
  selector: 'app-dashboardperson',
  templateUrl: './dashboard-person.component.html',
  styleUrls: ['./../dashboard.component.css']
})
export class DashboardPersonComponent implements OnInit {
  public maindatas = [];
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
  public CellWidth = 140;
  // public TimeConverterToPx = 0.09375;
  public TimeConverterToPx = this.CellWidth / ((24 - this.ShowMorningDiff - this.ShowNightDiff) * 60);
  // tslint:disable-next-line: max-line-length
  constructor(private personService: PersonService, private route: ActivatedRoute, private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.vatNumber = this.loginuserdetails.customerVatNumber;
    this.SelectedDates = this.getSelectedDates();
    // console.log('DashboardPersonComponent this.vatNumber : ' + this.vatNumber);

    this.personService.getDpsScheduleByVatNumber(this.vatNumber, this.startDate, this.endDate)
      .subscribe(dpsSchedule => {
        console.log('getDpsScheduleByVatNumber in DashboardPersonComponent ::', dpsSchedule);
        this.maindatas = dpsSchedule.persons;
        console.log('maindatas ::', this.maindatas);
      }, error => this.errorMsg = error);

    console.log('this.currentPage : ' + this.currentPage);
    if (this.currentPage === 'contract') {
      if (this.Id !== '' || this.Id !== undefined || this.Id !== null) {
        // openContract();
      }
    }
  }

  addWeek() {
    this.WeekDiff += 1;
    this.SelectedDates = this.getSelectedDates();
    // console.log('this.SelectedDates ::', this.SelectedDates);
  }

  minusWeek() {
    this.WeekDiff -= 1;
    this.SelectedDates = this.getSelectedDates();
  }

  getSelectedDates() {
    let curr = new Date();
    let curre = new Date();
    const adjustDaysForWeekStartDate = curr.getUTCDay() - 1;

    curr.setDate(curr.getUTCDate() - adjustDaysForWeekStartDate);
    curre.setDate(curr.getUTCDate() - (adjustDaysForWeekStartDate - 7));
    const adddays: number = this.WeekDiff * 7;
    curr.setDate(curr.getUTCDate() + adddays);
    curre.setDate(curre.getUTCDate() + adddays);

    const first = curr.getUTCDate();

    const mon = new Date(curr);
    const tue = new Date(curr.setDate(first + 1));
    const wed = new Date(curr.setDate(first + 2));
    const thu = new Date(curr.setDate(first + 3));
    const fri = new Date(curr.setDate(first + 4));
    const sat = new Date(curr.setDate(first + 5));
    const sun = new Date(curre);

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
      selectedContract.contractId = contractid;
      selectedContract.personId = personid;
      selectedContract.startDate = this.startDate;
      selectedContract.endDate = this.endDate;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = selectedContract;
      console.log('selectedContract :: ', selectedContract);
      dialogConfig.ariaLabel = 'Arial Label Positions Dialog';

      const dialogRef = this.dialog.open(CreateContractComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);

        /*
        if (this.SelectedIndex >= 0) {
          this.maindatas[this.SelectedIndex] = this.data;
          this.FilterTheArchive();
          this.ShowMessage('Positions "' + this.data.position.name + '" is updated successfully.', '');
        } else {
          console.log('this.data.id :: ', this.data.id);
          if (parseInt('0' + this.data.id, 0) > 0) {
            this.maindatas.push(this.data);
            console.log(' new this.maindatas :: ', this.maindatas);
            this.FilterTheArchive();
            this.ShowMessage('Positions "' + this.data.position.name + '" is added successfully.', '');
          }
        }
        */
      });
    } catch (e) { alert(e.message); }
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
