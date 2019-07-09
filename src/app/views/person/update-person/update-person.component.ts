import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DpsPerson, Person, LoginToken } from 'src/app/shared/models';
import { PersonService } from 'src/app/shared/person.service';
import { ContactPersonComponent } from '../../../contactperson/contactperson.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { LoggingService } from '../../../shared/logging.service';
import { environment } from 'src/environments/environment.prod';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-update-person',
  templateUrl: './update-person.component.html',
  styleUrls: ['./../person.component.css']
})
export class UpdatePersonComponent implements OnInit {
  public SelectedPage = 'UpdatePerson';
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public loginaccessToken: string = this.dpsLoginToken.accessToken;
  public PersonInitial = '';
  public PersonName = '';
  public currentPage = '';
  public dpsPerson: DpsPerson;
  public person: any;
  public vatNumber: string;
  public SocialSecurityId: string;
  public Action = '';
  public Id = '';
  public editPersonData: any;
  public editPersonValid = false;
  public personpositionData: any;
  public personDocumentsData: any;
  public archiveDisable = false;

  constructor(
    private personService: PersonService, private data: DataService,
    private logger: LoggingService,
    // private spinner: NgxUiLoaderService,
    private route: ActivatedRoute, private router: Router,
    private snackBar: MatSnackBar) {
    // this.logger.log('InSide :: Update Person');
    this.validateLogin();
    this.vatNumber = this.dpsLoginToken.customerVatNumber;
    // this.logger.log('vatNumber :: ' + this.vatNumber);
  }

  validateLogin() {
    try {
      // this.logger.log('this.loginaccessToken :: ' + this.loginaccessToken);
      if (this.loginaccessToken === null || this.loginaccessToken === '' || this.loginaccessToken === undefined) {
        this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
        this.logger.log('Redirect Breaked 8');
        this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
      }
    } catch (e) {
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
      this.logger.log('Redirect Breaked 7');
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
      // alert(e.message);
    }
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

  ngOnInit() {
    const sub = this.route.params.subscribe((params: any) => {
      this.Id = params.id;
      this.currentPage = params.page;
      this.onPageInit();
    });

    this.data.currentMessage.subscribe(message => this.filterData(message));

  }

  filterData(message: any) {

    // this.logger.log('received message in update person');
    // this.logger.log(message.data);

    if (message.page === 'edit') {
      this.editPersonData = message.data;
      this.editPersonValid = message.valid;
      // this.logger.log("received person data=" + this.editPersonData);
    }

    if (message.page === 'position') {
      this.personpositionData = message.data;
      // this.logger.log("received person data=" + this.editPersonData);
    }

    if (message.page === 'documents') {
      this.personDocumentsData = message.data;
      // this.logger.log("received person data=" + this.editPersonData);
    }

  }

  changeMessage() {
    // this.logger.log(this.dpsPerson);
    if (this.dpsPerson !== null) {
      const newmessage: any = {
        page: 'edit',
        data: this.dpsPerson
      };
      this.data.changeMessage(newmessage);
    }
  }

  onPageInit() {
    if (this.Id === null || this.Id === '' || this.Id === undefined) {
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... 404');
      this.router.navigate(['/404']);
    } else { this.SocialSecurityId = this.Id; }
    if (this.currentPage === 'documents' || this.currentPage === 'document') {
      this.currentPage = 'documents';
    } else if (this.currentPage === 'positions' || this.currentPage === 'position') {
      this.currentPage = 'positions';
    } else {
      this.currentPage = 'editperson';
    }

    // this.logger.log('SocialSecurityId :: ' + this.SocialSecurityId);
    // this.logger.log('CurrentPage :: ' + this.currentPage);

    try {
      // this.logger.log('Social Security Id :: ' + this.SocialSecurityId, 'Vat Number ::' + this.vatNumber);
      this.personService.getPersonBySSIDVatnumber(this.SocialSecurityId, this.vatNumber).subscribe(dpsperson => {
        this.dpsPerson = dpsperson;
        this.person = this.dpsPerson.person;

        this.changeMessage();

        this.PersonName = this.dpsPerson.person.firstName + ' ' + this.dpsPerson.person.lastName;

        if (this.dpsPerson.activeContractCount > 0) { this.archiveDisable = true; }

        if (this.dpsPerson.person.lastName === '' || this.dpsPerson.person.lastName === null ||
          this.dpsPerson.person.lastName === undefined) {
          this.PersonInitial = this.dpsPerson.person.firstName.substring(0, 2);
        } else {
          this.PersonInitial = this.dpsPerson.person.firstName.substring(0, 1) + this.dpsPerson.person.lastName.substring(0, 1);
        }
        // this.ShowMessage('Person fetched successfully.', '');
      }, error => this.ShowMessage(error, 'error'));
    } catch (e) {
      this.PersonName = 'Error!!';
    }
  }

  archiveClick() {
    if (confirm('Weet je zeker dat je deze persoon wilt verwijderen?')) {

      if (this.dpsPerson !== undefined && this.dpsPerson !== null) {
        this.dpsPerson.isArchived = true;

        // if contracts are active then it should be given a warning other disabled

        this.personService.updatePosition(this.dpsPerson).subscribe(res => {
          // console.log("response=" + res);
          this.ShowMessage('archivering kan niet ongedaan worden gemaakt', '');
          this.router.navigate(['/dashboard']);
        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Error occured=' + err.error.message);
          } else {
            console.log('response code=' + err.status);
            console.log('response body=' + err.error);
          }
        });
      }
    }
  }

  onFormwardClick() {

    this.logger.log('forward click has been clicked!!');

    if (this.currentPage === 'editperson') {

      if (this.editPersonValid === true) {
        this.ShowMessage('Persoon is succesvol geüpdatet.', '');
        this.personService.updatePosition(this.editPersonData).subscribe(res => {
          this.logger.log('response=' + res);
          this.ShowMessage('Persoon is succesvol geüpdatet.', '');
        },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {

              if (err.status === 200) {
                this.ShowMessage('Persoon is succesvol bijgewerkt.', '');
              }

            } else {
              this.logger.log('response code=' + err.status);
              this.logger.log('response body=' + err.error);
            }
          }
        );
      }

    }

    if (this.currentPage === 'positions') {
      // this.ShowMessage('Persoon is succesvol bijgewerkt.', '');
      this.personService.updatePosition(this.personpositionData).subscribe(res => {
        this.logger.log('response=' + res);
        this.ShowMessage('Persoon is succesvol bijgewerkt 20.', '');
      },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            this.ShowMessage('Persoon is succesvol bijgewerkt 40.', '');
          } else {
            if (err.status === 200) {
              this.ShowMessage('Persoon is succesvol bijgewerkt 30.', '');
            } else {
              this.logger.log('response code=' + err.status);
              this.logger.log('response body=' + err.error);
              this.ShowMessage('Persoon is succesvol bijgewerkt 10.', '');
            }
          }
        }
      );
    }

    if (this.currentPage === 'documents') {
      if (this.personDocumentsData !== null && this.personDocumentsData !== undefined) {
        this.personService.updatePersonDocumentDetails(this.personDocumentsData).subscribe(res => {
          this.logger.log('response=' + res);
          this.ShowMessage('Persoon is succesvol bijgewerkt 20.', '');
        },
          (err: HttpErrorResponse) => {
            if (err.status === 200) {
              this.ShowMessage('Persoon is succesvol bijgewerkt 40.', '');
            } else {
              if (err.status === 200) {
                this.ShowMessage('Persoon is succesvol bijgewerkt 30.', '');
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
                this.ShowMessage('Persoon is succesvol bijgewerkt 10.', '');
              }
            }
          }
        );
      }
    }
  }
}
