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
  public pageType: string;

  constructor(
    private customerService: CustomersService,
    private data: DataService,
    private logger: LoggingService) {

    // this.vatNumber = this.dpsLoginToken.customerVatNumber;
    this.editObject = {
      data: '',
      page: ''
    };

    this.pageType = "edit";

  }

  ngDoCheck() {
    if (this.HQdata !== this.oldHQdata) {
      this.oldHQdata = this.HQdata;
    }
  }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.pageType = "edit";
    this.vatNumber = this.CustomerVatNumber;
    this.getCustomerByVatNumberEdit(this.vatNumber);

  }

  ngOnDestroy() { this.logger.log('object destroyed'); }

  receiveHQdata($event) {
    this.HQdata = $event;
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
        this.HQdata.customer.vcaCertification.cerified = this.GLdata.vcaObject.cerified;
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
        this.childEvent.emit(this.HQdata);
      }
    }
  }

  receiveInvoiceData($event) {

    this.FPdata = $event;

    if (this.HQdata !== null && this.HQdata !== undefined) {
      if (this.FPdata !== null && this.FPdata !== undefined) {
        this.HQdata.invoiceSettings = new InvoiceSettings();
        this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
        this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
        this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
        this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
        this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
        this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
        this.HQdata.invoiceSettings.otherAllowance = this.FPdata.otherAllowance;
        this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;
        this.HQdata.invoiceSettings.transportCoefficient = this.FPdata.transportCoefficient;
        this.HQdata.invoiceSettings.mealvoucherCoefficient = this.FPdata.mealvoucherCoefficient;
        this.HQdata.invoiceSettings.ecoCoefficient = this.FPdata.ecoCoefficient;
        this.HQdata.invoiceSettings.dimonaCost = this.FPdata.dimonaCost;
      }
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

    if (response !== null && response !== undefined) {
      if (response.contact !== null && response.contact !== undefined) {

        if (this.HQdata.contact === null || this.HQdata.contact === undefined)
          this.HQdata.contact = new Contact();

        if (response.contact.firstName !== undefined && response.contact.firstName !== null)
          this.HQdata.contact.firstName = response.contact.firstName;

        if (response.contact.lastName !== null && response.contact.lastName !== undefined)
          this.HQdata.contact.lastName = response.contact.lastName;

        if (response.contact.email !== null && response.contact.email !== undefined) {
          this.HQdata.contact.email = new EmailAddress();
          this.HQdata.contact.email.emailAddress = response.contact.email.emailAddress;
        }

        if (response.contact.language !== undefined && response.contact.language !== null) {
          this.HQdata.contact.language = new Language();

          if (response.contact.language.name !== null && response.contact.language.name !== undefined)
            this.HQdata.contact.language.name = response.contact.language.name;

          if (response.contact.language.shortName !== null && response.contact.language.shortName !== undefined)
            this.HQdata.contact.language.shortName = response.contact.language.shortName;
        }

        if (response.contact.mobile !== null && response.contact.mobile !== undefined) {
          this.HQdata.contact.mobile = new PhoneNumber();
          this.HQdata.contact.mobile.number = response.contact.mobile.number;
        }

        if (response.contact.phoneNumber !== null && response.contact.phoneNumber !== undefined) {
          this.HQdata.contact.phoneNumber = new PhoneNumber();
          this.HQdata.contact.phoneNumber.number = response.contact.phoneNumber.number;
        }

        if (response.contact.postion !== null && response.contact.postion !== undefined)
          this.HQdata.contact.postion = response.contact.postion;

        if (response.activateContactAsUser !== null && response.activateContactAsUser !== undefined)
          this.HQdata.activateContactAsUser = response.activateContactAsUser;

        this.HQdata.formValid = true;

        this.childEvent.emit(this.HQdata);
      }

    }

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
          this.HQdata.invoiceSettings.otherAllowance = this.FPdata.otherAllowance;
          this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;
          this.HQdata.invoiceSettings.transportCoefficient = this.FPdata.transportCoefficient;
          this.HQdata.invoiceSettings.mealvoucherCoefficient = this.FPdata.mealvoucherCoefficient;
          this.HQdata.invoiceSettings.ecoCoefficient = this.FPdata.ecoCoefficient;
          this.HQdata.invoiceSettings.dimonaCost = this.FPdata.dimonaCost;

        }
        this.childEvent.emit(this.HQdata);
      }
    }
  }
}