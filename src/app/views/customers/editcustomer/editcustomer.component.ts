import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { Contact, DpsUser, DPSCustomer, Customer, InvoiceSettings, CreditCheck, Language, EmailAddress, PhoneNumber } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { DataService } from 'src/app/shared/data.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { LoggingService } from '../../../shared/logging.service';

@Component({
  selector: 'app-editcustomer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class EditCustomerComponent implements OnInit {

  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));
  @Input() CustomerVatNumber: string;
  @Output() public childEvent = new EventEmitter();
  public HQdata: any;
  public CTdata: any;
  public GLdata: any;
  public STdata: any;
  public FPdata: any;
  public vatNumber: string;
  public editObject: any = { data: '', page: '' };
  public oldHQdata: any;
  public dataCustomerEdit: any;

  constructor(
    private customerService: CustomersService, private data: DataService,
    private logger: LoggingService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    // this.vatNumber = this.loginuserdetails.customerVatNumber;
    this.editObject = {
      data: '',
      page: ''
    };

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


  ngDoCheck() {
    if (this.HQdata !== this.oldHQdata) {
      this.oldHQdata = this.HQdata;
      this.childEvent.emit(this.HQdata);
      // this.data.currentMessage.subscribe(data => this.HQdata = data);
    }
  }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.vatNumber = this.CustomerVatNumber;
    this.logger.log('ngOnInit called editcustomer');
    this.logger.log('vatNumber=' + this.vatNumber);
    this.getCustomerByVatNumberEdit(this.vatNumber);

    this.ShowMessage("Loading Data Successfully", "");
  }

  ngOnDestroy() { this.logger.log('object destroyed'); }

  receiveHQdata($event) {

    this.HQdata = $event;
    this.logger.log('received in editcustomer component');
    this.logger.log(this.HQdata);
    this.logger.log("CTdata:");
    this.logger.log(this.CTdata);

    if (this.CTdata !== null && this.CTdata !== undefined) {
      this.HQdata.contact = this.CTdata.contact;
      this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
      this.HQdata.formValid = true;
    }

    if (this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== '') {
      this.logger.log('fp data=');
      this.logger.log(this.FPdata);
      this.logger.log('HQ data');
      this.logger.log(this.HQdata);

      this.HQdata.invoiceSettings = new InvoiceSettings();
      this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
      this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
      this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
      this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
      this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
      this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
      this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;

    }

    this.childEvent.emit(this.HQdata);
  }

  receiveCTdata($event) {

    this.CTdata = $event;
    this.logger.log('updated in editcustomer component');
    this.logger.log(this.CTdata);

    if (this.CTdata !== null && this.CTdata !== undefined) {
      this.HQdata.contact = this.CTdata.contact;
      this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
      this.HQdata.formValid = true;

      this.childEvent.emit(this.HQdata);
    }
  }

  receiveGeneralObject($event) {

    this.GLdata = $event;
    this.logger.log('received in editcustomer component');
    this.logger.log(this.HQdata);

    if (this.HQdata !== null && this.HQdata !== undefined) {
      if (this.GLdata !== null && this.GLdata !== undefined) {
        this.HQdata.customer.vcaCertification = this.GLdata.vcaObject;
        this.HQdata.bulkContractsEnabled = this.GLdata.blk;
      }
    }

    this.childEvent.emit(this.HQdata);
  }

  receiveStatuteData($event) {

    this.STdata = $event;
    this.logger.log('received in editcustomer component');
    this.logger.log(this.STdata);

    if (this.HQdata !== null && this.HQdata !== undefined) {
      if (this.STdata !== null && this.STdata !== undefined) {
        this.HQdata.statuteSettings = this.STdata;
      }
    }

    this.childEvent.emit(this.HQdata);
  }

  receiveInvoiceData($event) {

    this.FPdata = $event;
    this.logger.log('FP received in editcustomer component');
    this.logger.log(this.HQdata);

    if (this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== '') {
      this.logger.log('fp data=');
      this.logger.log(this.FPdata);
      this.logger.log('HQ data');
      this.logger.log(this.HQdata);

      this.HQdata.invoiceSettings = new InvoiceSettings();
      this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
      this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
      this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
      this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
      this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
      this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
      this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;

      this.childEvent.emit(this.HQdata);
    }
  }

  postData() { }

  getCustomerByVatNumberEdit(vatNumber: string) {
    this.logger.log('calling get customer by vatnumber on edit page');
    let response: DPSCustomer;
    this.customerService.getCustomersByVatNumberEdit(vatNumber)
      .subscribe(data => {
        response = data;
        this.logger.log('response=');
        this.logger.log('response name=' + response.customer.name);
        this.parseData(response);
      }, error => this.handleError(error));
  }

  parseData(response: DPSCustomer) {
    this.logger.log(response);
    this.editObject = {
      data: response,
      page: 'edit'
    };

    this.HQdata.contact.firstName = response.contact.firstName;
    this.HQdata.contact.lastName = response.contact.lastName;
    this.HQdata.contact.email = response.contact.email;
    this.HQdata.contact.lastName = response.contact.language;
    this.HQdata.contact.mobile = response.contact.mobile;
    this.HQdata.contact.phoneNumber = response.contact.phoneNumber;
    this.HQdata.contact.postion = response.contact.postion;
    this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
    this.HQdata.formValid = true;
    this.childEvent.emit(this.HQdata);

    // this.HQdata = response;
  }
  handleError(error: any) { }

  editCustomerApi() {
    this.logger.log('edit customer Api called');
    if (this.HQdata !== null && this.HQdata !== undefined) {
      if (this.CTdata !== null && this.CTdata !== undefined) {
        this.HQdata.contact = this.CTdata;
      }
      if (this.GLdata !== null && this.GLdata !== undefined) {
        this.HQdata.customer.vcaCertification = this.GLdata.vcaObject;
        this.HQdata.bulkContractsEnabled = this.GLdata.blk;
      }
      if (this.STdata !== null && this.STdata !== undefined) {
        this.HQdata.statuteSettings = this.STdata;
      }
      if (this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== '') {
        this.logger.log('fp data=');
        this.logger.log(this.FPdata);
        this.logger.log('HQ data');
        this.logger.log(this.HQdata);

        if (this.HQdata.invoiceSettings !== undefined && this.HQdata.invoiceSettings !== null) {
          if (this.HQdata.invoiceSettings.lieuDaysAllowance !== undefined) {
            this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
          }
          this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
          this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
          this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
          this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
          this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
          this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;
        }
        this.childEvent.emit(this.HQdata);
      }
      this.logger.log('consolidated json object=');
      this.logger.log(this.HQdata);
    }
  }
}