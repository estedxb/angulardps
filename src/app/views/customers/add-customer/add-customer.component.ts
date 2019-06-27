import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactPersonComponent } from './../../../contactperson/contactperson.component';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Contact, DPSCustomer, Customer, InvoiceSettings, CreditCheck, Language, EmailAddress, PhoneNumber, Address, LoginToken, VcaCertification
} from 'src/app/shared/models';
import { DataService } from '../../../shared/data.service';
import { LoggingService } from '../../../shared/logging.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  public SelectedPage = 'AddCustomer';

  public HQdata: any;
  public CTdata: any;
  public GLdata: any;
  public STdata: any;
  public FPdata: any;
  public editObject: any = { data: '', page: '' };
  public vatNumber: string;
  public currentVatNumber: string;

  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));

  public HQFormValid: boolean;
  public CTFormValid: boolean;

  public Id = "";
  public currentPage = "";
  public pageType: string;
  public spinnerToggle:boolean = false;

  public showFormIndex = 1;
  constructor(private customerService: CustomersService, private logger: LoggingService,
    private dialog: MatDialog, private snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router, ) {

    this.editObject = { data: '', page: '' };

    this.pageType = "add";

  }


  ngOnInit() {
    this.HQFormValid = true;
    this.CTFormValid = true;
    this.pageType = "add";

    if (localStorage.getItem('dpsLoginToken') !== undefined &&
      localStorage.getItem('dpsLoginToken') !== '' &&
      localStorage.getItem('dpsLoginToken') !== null) {
      const sub = this.route.params.subscribe((params: any) => {
        this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
        this.Id = params.id;
        this.currentPage = params.page;
      });
    } else {
      this.logger.log('localStorage.getItem("dpsLoginToken") not found.', this.dpsLoginToken);
      // this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');

      this.logger.log('Redirect Breaked 9');
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }

  }

  receiveData($event, i) {
    if (i === 0) {
      this.HQdata = $event;
    } else if (i === 1) {
      this.CTdata = $event;
    } else if (i === 2) {
      this.GLdata = $event;
    } else if (i === 3) {
      this.STdata = $event;
    } else if (i === 4) {
      this.FPdata = $event;
    }
  }

  receiveGeneralObject($event) {
    this.logger.log('received in home component GL data');
    this.GLdata = $event;
    this.logger.log(this.GLdata);
  }

  receiveStatuteData($event) {
    this.logger.log('received in home component ST data');
    this.STdata = $event;
    this.logger.log(this.STdata);
  }

  receiveInvoiceData($event) {
    this.logger.log('received in home component IS data');
    this.FPdata = $event;
    this.logger.log(this.FPdata);
  }

  receiveHQdata($event) {
    this.HQdata = $event;
    this.HQFormValid = this.HQdata.formValid;
    this.currentVatNumber = this.HQdata.customer.vatNumber;
    this.logger.log('received in home component HQ data');
    this.logger.log(this.HQdata);
  }

  receiveCTdata($event) {
    this.CTdata = $event;
    this.CTFormValid = this.CTdata.formValid;
    this.logger.log('received in home component CT data');
    this.logger.log(this.CTdata);
  }

  onFormwardClick() {
    document.getElementById('maincontent').scrollTo(0, 0);

    if (this.showFormIndex === 1) {

      this.logger.log('CTdata=' + this.CTdata);
      this.logger.log(this.CTdata);
      this.logger.log('HQdata=' + this.HQdata);
      this.logger.log(this.HQdata);

      this.logger.log('validity data=' + this.HQdata.formValid);

      if (this.HQdata !== undefined && this.HQdata !== null && this.CTdata !== undefined && this.CTdata !== null) {
        if (this.HQdata.formValid === true && this.CTdata.formValid === true) {
          this.showFormIndex = 2;

          delete this.HQdata.formValid;
          delete this.CTdata.formValid;

          this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
          this.HQdata.contact = this.CTdata.contact;

          this.logger.log('updated HQData=' + this.HQdata);
          this.logger.log(this.HQdata.contact);
          this.logger.log(this.CTdata.contact);


          this.customerService.createCustomer(this.HQdata).subscribe(res => {
            this.logger.log('response=' + res);
            this.ShowMessage("Klantrecord met succes gemaakt!", '');
          },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                this.ShowMessage("Geen klant te maken!", '');
                this.logger.log('Error occured=' + err.error.message);
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
              }
            }
          );
        }
      } else {
        this.logger.log('HQdata or CTdata is null or undefined !!');
      }


    } else
      if (this.showFormIndex === 2) {
        this.logger.log('Complete data=');
        this.logger.log(this.GLdata);

        this.logger.log('HQdata');
        this.logger.log(this.HQdata);

        this.logger.log('this STdata');
        this.logger.log(this.STdata);

        if (this.HQdata !== null && this.HQdata !== undefined) {
          if (this.GLdata !== null && this.GLdata !== undefined) {
            this.HQdata.customer.vcaCertification = new VcaCertification();
            this.HQdata.customer.vcaCertification = this.GLdata.vcaObject;
            this.HQdata.bulkContractsEnabled = this.GLdata.blk;
          }

          if (this.CTdata !== null && this.CTdata !== undefined)
            this.HQdata.contact = this.CTdata.contact;

          if (this.STdata !== null && this.STdata !== undefined) {
            this.HQdata.statuteSettings = this.STdata;
          }

          if (this.FPdata !== null && this.FPdata !== undefined)
            this.HQdata.invoiceSettings = this.FPdata;

          this.logger.log(this.HQdata);
          this.updateData();
        }
        else {
          this.logger.log("empty hq data");
        }
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

  updateData() {

    this.logger.log("before update");
    this.logger.log(this.HQdata);

    this.customerService.createCustomerUpdate(this.HQdata).subscribe(res => {
      this.logger.log('response=' + res);
      this.ShowMessage('Klantrecord met succes gemaakt!', '');
      // this.showFormIndex = 3;      
      this.logger.log('Redirect Breaked 11');
      this.router.navigate(['/dashboard']);
      this.spinnerToggle = true;
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.ShowMessage("Geen klant te maken!", '');
          this.logger.log('Error occured=' + err.error.message);
        } else {
          this.logger.log('response code=' + err.status);
          this.logger.log('response body=' + err.error);
        }
      }
    );
  }

  getCustomerByVatNumberEdit(vatNumber: string) {
    let response: DPSCustomer;
    this.customerService.getCustomersByVatNumberEdit(vatNumber)
      .subscribe(data => {
        response = data;
        //this.parseData(response);
        this.logger.log("response object in from api");
        this.logger.log(this.editObject);
        this.editObject = {
          data: response,
          page: 'edit'
        };

      }, error => this.handleError(error));
  }

  parseData(response: DPSCustomer) {

    this.HQdata = new DPSCustomer();
    this.HQdata.customer = new Customer();
    this.HQdata.customer.vatNumber = response.customer.vatNumber;
    this.HQdata.customer.name = response.customer.name;
    this.HQdata.customer.officialName = response.customer.officialName;
    this.HQdata.customer.legalForm = response.customer.legalForm;

    this.HQdata.customer.creditCheck = new CreditCheck();
    this.HQdata.customer.creditCheck.creditcheck = response.customer.creditCheck.creditcheck;
    this.HQdata.customer.creditCheck.creditLimit = response.customer.creditCheck.creditLimit;
    this.HQdata.customer.creditCheck.dateChecked = response.customer.creditCheck.dateChecked;
    this.HQdata.customer.creditCheck.creditCheckPending = response.customer.creditCheck.creditCheckPending;

    this.HQdata.customer.address = new Address();
    this.HQdata.customer.address.street = response.customer.address.street;
    this.HQdata.customer.address.streetNumber = response.customer.address.streetNumber;
    this.HQdata.customer.address.bus = response.customer.address.bus;
    this.HQdata.customer.address.city = response.customer.address.city;
    this.HQdata.customer.address.postalcode = response.customer.address.postalCode;
    this.HQdata.customer.address.country = response.customer.address.country;
    this.HQdata.customer.address.countryCode = response.customer.address.countryCode;

    this.HQdata.customer.vcaCertification = { cerified: response.customer.vcaCertification };
    this.HQdata.bulkContractsEnabled = response.bulkContractsEnabled;

    this.HQdata.contact = new Contact();
    this.HQdata.contact.firstName = response.contact.firstName;
    this.HQdata.contact.lastName = response.contact.lastName;
    this.HQdata.contact.email = response.contact.email;
    this.HQdata.contact.lastName = response.contact.language;
    this.HQdata.contact.mobile = response.contact.mobile;
    this.HQdata.contact.phoneNumber = response.contact.phoneNumber;
    this.HQdata.contact.postion = response.contact.postion;
    this.HQdata.activateContactAsUser = response.activateContactAsUser;
    this.HQdata.formValid = true;

    this.editObject = {
      data: response,
      page: 'edit'
    };

    this.logger.log("response object in from api");
    this.logger.log(this.editObject);
  }

  handleError(error: any) { }

  onBackwardClick() {
    document.getElementById('maincontent').scrollTo(0, 0);
    this.logger.log("current vat number");
    this.logger.log(this.currentVatNumber);
    this.getCustomerByVatNumberEdit(this.currentVatNumber);
    this.showFormIndex = 1;
  }

}
