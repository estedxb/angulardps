import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DpsPerson, Person } from 'src/app/shared/models';
import { PersonService } from 'src/app/shared/person.service';
import { ContactPersonComponent } from '../../../contactperson/contactperson.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-update-person',
  templateUrl: './update-person.component.html',
  styleUrls: ['./../person.component.css']
})
export class UpdatePersonComponent implements OnInit {
  public loginaccessToken: string = localStorage.getItem('accesstoken');
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));
  public PersonInitial = '';
  public PersonName = '';
  public currentPage = '';
  public dpsPerson: any;
  public person: any;
  public vatNumber: string;
  public SocialSecurityId: string;
  public Action = '';
  public Id = '';
  public editPersonData: any;
  public personpositionData: any;

  constructor(private personService: PersonService, private data: DataService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
    console.log('InSide :: Update Person');
    this.validateLogin();
    this.vatNumber = this.loginuserdetails.customerVatNumber;
    console.log('vatNumber :: ' + this.vatNumber);
  }

  validateLogin() {
    try {
      console.log('this.loginaccessToken :: ' + this.loginaccessToken);
      if (this.loginaccessToken === null || this.loginaccessToken === '' || this.loginaccessToken === undefined) {
        this.router.navigate(['/login']);
      }
    } catch (e) {
      this.router.navigate(['/login']);
      alert(e.message);
    }
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

  ngOnInit() {
    const sub = this.route.params.subscribe((params: any) => {
      this.Id = params.id;
      this.currentPage = params.page;
      this.onPageInit();
    });

    this.data.currentMessage.subscribe(message => this.filterData(message));

  }

  filterData(message:any) {

      if(message.page === "edit")
        this.editPersonData = message.data;

      if(message.page === "position")
        this.personpositionData = message.data;
  }

  onPageInit() {
    if (this.Id === null || this.Id === '' || this.Id === undefined) {
      this.router.navigate(['/404']);
    } else { this.SocialSecurityId = this.Id; }
    if (this.currentPage === 'documents' || this.currentPage === 'document') {
      this.currentPage = 'documents';
    } else if (this.currentPage === 'positions' || this.currentPage === 'position') {
      this.currentPage = 'positions';
    } else {
      this.currentPage = 'editperson';
    }

    console.log('SocialSecurityId :: ' + this.SocialSecurityId);
    console.log('CurrentPage :: ' + this.currentPage);

    try {
      console.log('Social Security Id :: ' + this.SocialSecurityId, 'Vat Number ::' + this.vatNumber);
      this.personService.getPersonBySSIDVatnumber(this.SocialSecurityId, this.vatNumber).subscribe(dpsperson => {
        this.dpsPerson = dpsperson.body;
        this.person = this.dpsPerson.person;
        console.log('DPS Person Form Data : ', dpsperson);
        console.log('Person Form Data : ', this.person);
        this.PersonName = this.dpsPerson.person.firstName + ' ' + this.dpsPerson.person.lastName;
        if (this.dpsPerson.person.lastName === '' || this.dpsPerson.person.lastName === null ||
          this.dpsPerson.person.lastName === undefined) {
          this.PersonInitial = this.dpsPerson.person.firstName.substring(0, 2);
        } else {
          this.PersonInitial = this.dpsPerson.person.firstName.substring(0, 1) + this.dpsPerson.person.lastName.substring(0, 1);
        }
        this.ShowMessage('Person fetched successfully.', '');
      }, error => this.ShowMessage(error, 'error'));
    } catch (e) {
      this.PersonName = 'Error!!';
    }
  }

  onFormwardClick() {

    if(this.currentPage === "editperson")
    {
      console.log("data collected");
      console.log(this.editPersonData);

      this.personService.updatePosition(this.editPersonData).subscribe(res => {
        console.log("response=" + res);
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Error occured=" + err.error.message);
          }
          else {
            console.log("response code=" + err.status);
            console.log("response body=" + err.error);
          }
        }
      );

    }

    if(this.currentPage === "positions")
    {
      console.log("data collected for positions");
      console.log(this.personpositionData);

      this.personService.updatePosition(this.personpositionData).subscribe(res => {
        console.log("response=" + res);
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Error occured=" + err.error.message);
          }
          else {
            console.log("response code=" + err.status);
            console.log("response body=" + err.error);
          }
        }
      );
    }

    if(this.currentPage === "documents"){

    }

  }

}
