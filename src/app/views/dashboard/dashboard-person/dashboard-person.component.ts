import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DpsPerson, Person, SelectedContract } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig } from '@angular/material';
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

  // tslint:disable-next-line: max-line-length
  constructor(private personService: PersonService, private route: ActivatedRoute, private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.vatNumber = this.loginuserdetails.customerVatNumber;
    this.SelectedDates = this.getSelectedDates();
    console.log('DashboardPersonComponent this.vatNumber : ' + this.vatNumber);

    this.personService.getPersonsContractsByVatNumber(this.vatNumber, this.startDate, this.endDate)
      .subscribe(persons => {
        this.maindatas = persons;
        console.log('getPersonsContractsByVatNumber in DashboardPersonComponent ::', this.maindatas);
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
  }

  minusWeek() {
    this.WeekDiff -= 1;
    this.SelectedDates = this.getSelectedDates();
  }

  getSelectedDates() {
    const curr = new Date();
    let first = curr.getDate() - curr.getDay() + (this.WeekDiff * 7);
    console.log('curr.getDate :: ', curr.getDate());
    console.log('curr.getDay :: ', curr.getDay());
    console.log('first :: ', first);
    first = first + 1;
    console.log('first 2 :: ', first);
    const last = first + 6;

    const monday = new Date(curr.setDate(first)).toUTCString();
    const sunday = new Date(curr.setDate(last)).toUTCString();
    console.log(monday + ' ' + sunday);

    this.startDate = new Date(monday);
    this.endDate = new Date(sunday);
    // tslint:disable-next-line: max-line-length
    return this.startDate.getUTCDate().toString() + ' - ' + this.endDate.getUTCDate().toString() + ' ' + this.getShortMonth(this.startDate) + '. ' + this.endDate.getUTCFullYear();
  }
  getShortMonth(date) {
    return date.toLocaleString('nl-NL', { month: 'long' });
  }

  OpenAddPersonURL() {
    this.router.navigate(['./person/add']);
  }

  openContractDialog(personid, contractid): void {
    try {
      const selectedContract = new SelectedContract();
      selectedContract.contractId = contractid;
      selectedContract.personId = personid;
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

}
