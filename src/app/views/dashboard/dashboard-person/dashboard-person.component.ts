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

  constructor(
    private personService: PersonService, private route: ActivatedRoute,
    private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.onPageInit();
  }

  onPageInit() {
    this.vatNumber = this.loginuserdetails.customerVatNumber;
    console.log('this.vatNumber : ' + this.vatNumber);
    if (this.currentPage === 'contract') {
      if (this.Id !== '' || this.Id !== undefined || this.Id !== null) {
        // openContract();
        this.personService.getPersonsByVatNumber(this.vatNumber)
          .subscribe(persons => {
            this.maindatas = persons;
            console.log('getPersonsByVatNumber in dashboard-person.component ::');
            console.log(persons);
          }, error => this.errorMsg = error);
      }
    }
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
    } catch (e) { alert(e.message);}
  }

}
