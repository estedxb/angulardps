import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { Contact, DpsUser, LoginToken, DPSCustomer, Customer, InvoiceSettings, CreditCheck, Language, EmailAddress, PhoneNumber } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { DataService } from 'src/app/shared/data.service';
import { LoggingService } from '../../../shared/logging.service';

@Component({
  selector: 'app-editcustomer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class EditCustomerComponent implements OnInit {

  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
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
    private logger: LoggingService) {
      
    // this.vatNumber = this.dpsLoginToken.customerVatNumber;
    this.editObject = {
      data: '',
      page: ''
    };

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
    this.getCustomerByVatNumberEdit(this.vatNumber);

    //this.ShowMessage("Loading Data Successfully", "");
  }

  ngOnDestroy() { this.logger.log('object destroyed'); }

  receiveHQdata($event) {

    this.HQdata = $event;

    if (this.CTdata !== null && this.CTdata !== undefined) {
      this.HQdata.contact = this.CTdata.contact;
      this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
      this.HQdata.formValid = true;
    }

    if (this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== '') {

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

    if (this.CTdata !== null && this.CTdata !== undefined) {
      this.HQdata.contact = this.CTdata.contact;
      this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
      this.HQdata.formValid = true;

      this.childEvent.emit(this.HQdata);
    }
  }

  receiveGeneralObject($event) {

    this.GLdata = $event;

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

    if (this.HQdata !== null && this.HQdata !== undefined) {
      if (this.STdata !== null && this.STdata !== undefined) {
        this.HQdata.statuteSettings = this.STdata;
      }
    }

    this.childEvent.emit(this.HQdata);
  }

  receiveInvoiceData($event) {

    this.FPdata = $event;

    if (this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== '') {

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
    let response: any;
    this.customerService.getCustomersByVatNumberEdit(vatNumber)
      .subscribe(data => {
        response = data;
        this.parseData(response);
      }, error => this.handleError(error));
  }

  parseData(response: any) {
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
    }
  }
}