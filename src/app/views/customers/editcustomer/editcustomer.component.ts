import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { Contact, DpsUser, DPSCustomer, Customer, InvoiceSettings, CreditCheck, Language, EmailAddress, PhoneNumber } from 'src/app/shared/models';
import { CustomersService } from 'src/app/shared/customers.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-editcustomer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class EditCustomerComponent implements OnInit {

  // public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));
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

  constructor(private customerService: CustomersService, private data: DataService) {

    // this.vatNumber = "B0011";

    // console.log(this.vatNumber);

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
    console.log('ngOnInit called editcustomer');
    console.log('vatNumber=' + this.vatNumber);
    this.getCustomerByVatNumberEdit(this.vatNumber);
  }

  ngOnDestroy() {
    console.log('object destroyed');
  }

  receiveHQdata($event) {

    this.HQdata = $event;
    console.log('received in editcustomer component');
    console.log(this.HQdata);

    this.childEvent.emit(this.HQdata);
  }

  receiveCTdata($event) {

    this.CTdata = $event;
    console.log('updated in editcustomer component');
    console.log(this.CTdata);

    if (this.CTdata !== null && this.CTdata !== undefined) {
      this.HQdata.contact = this.CTdata.contact;
      this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
      this.HQdata.formValid = true;
      // "contact": this.contact,
      // "formValid": this.validity(),
      // "activateContactAsUser":this.alsCheck
      this.childEvent.emit(this.HQdata);
    }
  }

  receiveGeneralObject($event) {

    this.GLdata = $event;
    console.log('received in editcustomer component');
    console.log(this.HQdata);

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
    console.log('received in editcustomer component');
    console.log(this.STdata);

    if (this.HQdata !== null && this.HQdata !== undefined) {
      if (this.STdata !== null && this.STdata !== undefined) {
        this.HQdata.statuteSettings = this.STdata;
      }
    }
    this.childEvent.emit(this.HQdata);
  }

  receiveInvoiceData($event) {

    this.FPdata = $event;
    console.log('FP received in editcustomer component');
    console.log(this.HQdata);

    if (this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== '') {
      console.log('fp data=');
      console.log(this.FPdata);
      console.log('HQ data');
      console.log(this.HQdata);

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
    console.log('calling get customer by vatnumber on edit page');
    let response: DPSCustomer;
    this.customerService.getCustomersByVatNumberEdit(vatNumber)
      .subscribe(data => {
        response = data;
        console.log('response=');
        console.log('response name=' + response.customer.name);
        this.parseData(response);
      }, error => this.handleError(error));
  }

  parseData(response: DPSCustomer) {
    console.log(response);
    this.editObject = {
      data: response,
      page: 'edit'
    };
    // this.HQdata = response;
  }
  handleError(error: any) { }

  editCustomerApi() {
    console.log('edit customer Api called');
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
        console.log('fp data=');
        console.log(this.FPdata);
        console.log('HQ data');
        console.log(this.HQdata);

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
      console.log('consolidated json object=');
      console.log(this.HQdata);
    }
  }
}