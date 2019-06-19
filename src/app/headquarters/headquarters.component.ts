import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomersService } from '../shared/customers.service';
import {
  DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck,
  PhoneNumber, Address, StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance,
  InvoiceSettings, Language, Contact
} from '../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LegalComponent } from '../../app/componentcontrols/legal/legal.component';
import { ChildActivationEnd } from '@angular/router';
import { load } from '@angular/core/src/render3';
import { TimeSpan } from '../shared/TimeSpan';
import { DataService } from '../../../src/app/shared/data.service';

@Component({
  selector: 'app-headquarters',
  templateUrl: './headquarters.component.html',
  styleUrls: ['./headquarters.component.css']
})

export class HeadQuartersComponent implements OnInit {

  @ViewChild(LegalComponent) legalComponent;

  public legalString;
  public countryString;
  public countryCode;
  public nlegalString;

  @Input() public HQFormData;
  @Output() public childEvent = new EventEmitter();

  public oldData: any = {};
  public disabled;
  public ErrorResponseMessage;

  public creditcheckEdit: Boolean = false;

  HQdata: any;
  HQForm: FormGroup;

  verifiedCustomerData: any;

  getCustomersByvatNumberResponse: any;
  getCustomersByvatNumberErrorMessage: string;


  dpsCustomer: DPSCustomer;
  customer: Customer;

  generalEmail: EmailAddress;
  invoiceEmail: EmailAddress;
  contractsEmail: EmailAddress;
  contactsEmail: EmailAddress;

  vcaCertification: VcaCertification;
  creditCheck: CreditCheck;
  phoneNumber: PhoneNumber;
  address: Address;
  statuteSetting: StatuteSetting[];
  statuteSettingObject: StatuteSetting;
  statute: Statute;
  paritairCommitee: ParitairCommitee;
  mealVoucherSettings: MealVoucherSettings;
  lieuDaysAllowance: LieuDaysAllowance;
  mobilityAllowance: MobilityAllowance;
  shiftAllowance: ShiftAllowance[];
  otherAllowance: OtherAllowance[];
  shiftAllowanceObject: ShiftAllowance;
  otherAllowanceObject: OtherAllowance;
  invoiceSettings: InvoiceSettings;
  language: Language;
  contact: Contact;
  validated: Boolean;

  numberPattern: string;
  vatNumber: string;
  creditCheckLimit: number;

  allowCustomer: boolean;

  enable: boolean = true;
  change: boolean = false;
  valueChange: boolean = false;
  changeEvent: MouseEvent;
  _isDisabled: boolean = true;

  public EditdataFromComponents;
  public selectedLegalObject: any = { "FormName": "NV" };

  // ngAfterViewInit(){
  //   //this.legalString = this.legalComponent.selectedString;
  // }

  ngDoCheck() {

    //load Edit Page details
    if (this.oldData !== this.HQFormData) {
      if (this.HQFormData !== undefined && this.HQFormData.data !== "" && this.HQFormData.page === "edit") {
        this.oldData = this.HQFormData;
        this.loadDataEdit(this.HQFormData.data);
        this.updateData();
      }
    }
  }

  ngOnInit() {

    this.HQForm = new FormGroup({
      vatNumber: new FormControl('', [Validators.required, Validators.minLength(12), Validators.pattern("^[0-9]+$")]),
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      officialname: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z ]+$")]),
      creditCheck: new FormControl(),
      legalform: new FormControl(),
      creditLimit: new FormControl(),
      street: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z ]+$")]),
      streetnumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+$")]),
      bus: new FormControl('', Validators.pattern("^[0-9]+$")),
      city: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z ]+$")]),
      postalcode: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$")]),
      country: new FormControl(''),
      phonenumber: new FormControl('', Validators.required),
      invoiceEmail: new FormControl('', [Validators.required, Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")]),
      contractsEmail: new FormControl('', [Validators.required, Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")]),
      generalEmail: new FormControl('', [Validators.required, Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")])
    });

    this.HQForm.get('creditLimit').disable();
    // this.HQForm.get('vatNumber').disable();
    this.allowCustomer = false;
    //this.legalString = "BVBA";
    this.createObjects();  //check validations

  }

  constructor(private formBuilder: FormBuilder, private customerService: CustomersService, private data: DataService) {

  }

  ngAfterViewInit() {

    //load Edit Page details
    if (this.HQFormData!== null  && this.HQFormData !== undefined && this.oldData !== this.HQFormData) {
      if (this.HQFormData !== undefined && this.HQFormData.data !== "" && this.HQFormData.page === "edit") {
        this.oldData = this.HQFormData;
        this.loadDataEdit(this.HQFormData.data);
        this.updateData();
      }
    }

  }


  loadDataEdit(dpscustomer: DPSCustomer) {

    if (dpscustomer !== null) {
      this.HQForm.controls['vatNumber'].setValue(dpscustomer.customer.vatNumber);
      this.HQForm.controls['vatNumber'].disable();
      this.HQForm.controls['firstname'].setValue(dpscustomer.customer.name);
      this.HQForm.controls['officialname'].setValue(dpscustomer.customer.officialName);
      this.HQForm.controls['creditLimit'].setValue(dpscustomer.customer.creditCheck.creditLimit),
        this.creditcheckEdit = dpscustomer.customer.creditCheck.creditcheck;
      this.legalString = dpscustomer.customer.legalForm;

      this.HQForm.controls['street'].setValue(dpscustomer.customer.address.street);
      this.HQForm.controls['streetnumber'].setValue(dpscustomer.customer.address.streetNumber);
      this.HQForm.controls['bus'].setValue(dpscustomer.customer.address.bus);
      this.HQForm.controls['city'].setValue(dpscustomer.customer.address.city);
      this.HQForm.controls['postalcode'].setValue(dpscustomer.customer.address.postalCode);
      //this.HQForm.controls['country'].setValue(dpscustomer.customer.address.country);
      this.HQForm.controls['phonenumber'].setValue(dpscustomer.customer.phoneNumber.number);
      this.HQForm.controls['generalEmail'].setValue(dpscustomer.customer.email.emailAddress);
      this.HQForm.controls['contractsEmail'].setValue(dpscustomer.contractsEmail.emailAddress);
      this.HQForm.controls['invoiceEmail'].setValue(dpscustomer.invoiceEmail.emailAddress);

      this.countryString = dpscustomer.customer.address.country;

      this.invoiceSettings = new InvoiceSettings();
      this.invoiceSettings = dpscustomer.invoiceSettings;

      this.HQdata.invoiceSettings = dpscustomer.invoiceSettings;

    }

  }


  checkValidation() {
    if (this.HQForm.get('vatNumber').valid === true &&
      this.HQForm.get('firstname').valid === true &&
      this.HQForm.get('officialname').valid === true &&
      this.HQForm.get('street').valid === true &&
      this.HQForm.get('streetnumber').valid === true &&
      this.HQForm.get('bus').valid === true &&
      this.HQForm.get('city').valid === true &&
      this.HQForm.get('postalcode').valid === true &&
      this.HQForm.get('phonenumber').valid === true &&
      this.HQForm.get('invoiceEmail').valid === true &&
      this.HQForm.get('contractsEmail').valid === true &&
      this.HQForm.get('generalEmail').valid === true) {
      console.log("form valid");
      return true;
    }
    else {
      console.log("form not valid");
      console.log("vatnumber=" + this.HQForm.get('vatNumber').valid);
      console.log("firstname=" + this.HQForm.get('firstname').valid);
      console.log("name=" + this.HQForm.get('officialname').valid);
      console.log("street=" + this.HQForm.get('street').valid);
      console.log("streetnumber=" + this.HQForm.get('streetnumber').valid);
      console.log("bus=" + this.HQForm.get('bus').valid);
      console.log("city=" + this.HQForm.get('city').valid);
      console.log("postalcode=" + this.HQForm.get('postalcode').valid);
      console.log("phonenumber=" + this.HQForm.get('phonenumber').valid);
      console.log("invoiceEmail=" + this.HQForm.get('invoiceEmail').valid);
      console.log("contractsEmail=" + this.HQForm.get('contractsEmail').valid);
      console.log("generalEmail=" + this.HQForm.get('generalEmail').valid);

    }

    return false;
  }


  createObjects() {

    //all fields are validated
    this.setCreditCheck();
    this.setAddress();
    this.setCustomerObject();
    this.setStatuteSettingArray();
    this.setContacts();
    this.setDpsCustomer();
    this.setInvoiceSettings();
  }

  receiveMessage($event) {
    this.nlegalString = $event;
    this.selectedLegalObject = {"FormName": $event};
    this.setCustomerObject();
    this.createObjects();
  }

  receiveMessageCountry($event) {

    this.countryString = $event.Country;
    this.countryCode = $event['Alpha-2'];
    this.setAddress();
    this.setCustomerObject();
    this.createObjects();

  }

  creditLimitApi() {

    this.vatNumber = this.HQForm.get('vatNumber').value;

    //if(this.HQForm.get('vatNumber').valid === true)    
    this.getCustomerByVatNumber(this.vatNumber);

  }

  // response Codes: 
  // 400 vat number isn't valid 
  // 204 no record not allowed to create customer
  // 200 allow to create customer
  // 409 Customer already in the system dont allow to create new customer

  getCustomerByVatNumber(vatNumber: string) {

    let response: DPSCustomer;

    this.customerService.getCustomersByVatNumber(vatNumber)
      .subscribe(data => {
        response = data;
        console.log(response);

        this.allowCustomer = true;

        this.parseData(response);
      }, error => this.handleError(error));

  }

  handleError(errorMessage: any) {

    this.allowCustomer = false;

    if (errorMessage.status === 400)
      this.ErrorResponseMessage = "Btw-nummer is niet in correct formaat";
    if (errorMessage.status === 204)
      this.ErrorResponseMessage = "Geen record in ons systeem";
    if (errorMessage.status === 409)
      this.ErrorResponseMessage = "Klant met vatnummer bestaat al";

  }

  updateFirstName(firstname:string) {
    this.HQForm.controls['firstname'].setValue(firstname);
  }

  updateLastName(lastname:string) {
    this.HQForm.controls['lastname'].setValue(lastname);
  }

  clearError() {
    this.ErrorResponseMessage = "";
  }

  creditLimit(value: number) {
    this.HQForm.controls['creditLimit'].setValue(value);
  }


  parseData(response: DPSCustomer) {

    this.loadData(response);

    let creditCheckboolean: boolean = response.customer.creditCheck.creditcheck;
    this.creditCheckLimit = response.customer.creditCheck.creditLimit;

    if (creditCheckboolean === true)
      this.creditLimit(this.creditCheckLimit);
    else {
      this.creditLimit(this.creditCheckLimit);
    }

  }


  loadData(verifiedCustomerData: DPSCustomer) {

    if (verifiedCustomerData !== null) {
      if (verifiedCustomerData.customer !== null) {

        this.HQForm.controls['firstname'].setValue(verifiedCustomerData.customer.name);
        this.HQForm.controls['officialname'].setValue(verifiedCustomerData.customer.officialName);
        // this.HQForm.controls['legalForm'].setValue(verifiedCustomerData.customer.legalForm); // dropdown value

        this.legalString = verifiedCustomerData.customer.legalForm;

        if(verifiedCustomerData.customer.address !== null)
        {
          this.HQForm.controls['street'].setValue(verifiedCustomerData.customer.address.street);
          this.HQForm.controls['streetnumber'].setValue(verifiedCustomerData.customer.address.streetNumber);
          this.HQForm.controls['bus'].setValue(verifiedCustomerData.customer.address.bus);
          this.HQForm.controls['city'].setValue(verifiedCustomerData.customer.address.city);
          this.HQForm.controls['postalcode'].setValue(verifiedCustomerData.customer.address.postalCode);
          this.HQForm.controls['country'].setValue(verifiedCustomerData.customer.address.country);  
        }

        if (verifiedCustomerData.customer.phoneNumber !== null && verifiedCustomerData.customer.phoneNumber.number !== null)
          this.HQForm.controls['phonenumber'].setValue(verifiedCustomerData.customer.phoneNumber.number);

        if (verifiedCustomerData.customer.email !== null)
          this.HQForm.controls['generalEmail'].setValue(verifiedCustomerData.customer.email.emailAddress);

        if (verifiedCustomerData.contractsEmail !== null)
          this.HQForm.controls['contractsEmail'].setValue(verifiedCustomerData.contractsEmail.emailAddress);

        if (verifiedCustomerData.invoiceEmail !== null)
          this.HQForm.controls['invoiceEmail'].setValue(verifiedCustomerData.invoiceEmail.emailAddress);

      }
    }

  }

  onChange(value: boolean) {
    this.change = value;

    this.HQForm.get('creditLimit').disable();

    if (this.change === true)
      this.creditLimit(0);
    else
      this.creditLimit(0);

  }

  onChangeEvent(event: MouseEvent) {
    this.changeEvent = event;
  }

  onValueChange(value: boolean) {
    this.valueChange = value;
  }


  set isDisabled(value: boolean) {
    this._isDisabled = value;
    if (value) {
      this.HQForm.controls['creditLimit'].disable();
    } else {
      this.HQForm.controls['creditLimit'].enable();
    }
  }

  get toggleValue() {
    return this.change;
  }

  setCreditCheck() {
    var today = new Date();
    this.creditCheck = new CreditCheck();

    // assigning credit check object
    this.creditCheck.creditLimit = 0; //this.creditCheckLimit;
    this.creditCheck.creditcheck = false;
    this.creditCheck.creditCheckPending = false;
    this.creditCheck.dateChecked = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

    // console.log("today date checked=");
    // console.log("today day="+today.getDate());
    // console.log(this.creditCheck.dateChecked);

  }

  setAddress() {

    this.address = new Address();

    // assigning address object
    this.address.bus = this.HQForm.get('bus').value;
    this.address.city = this.HQForm.get('city').value;
    this.address.country = this.countryString;
    this.address.countryCode = this.countryCode;
    this.address.postalCode = this.HQForm.get('postalcode').value;
    this.address.street = this.HQForm.get('street').value;
    this.address.streetNumber = this.HQForm.get('streetnumber').value;

  }

  setCustomerObject() {


    this.customer = new Customer();
    this.generalEmail = new EmailAddress();
    this.vcaCertification = new VcaCertification();
    this.phoneNumber = new PhoneNumber();

    // assigning vca Object
    this.vcaCertification.cerified = true;

    // assigning general email address object
    this.generalEmail.emailAddress = this.HQForm.get('generalEmail').value;

    this.phoneNumber.number = this.HQForm.get('phonenumber').value;

    // assigning customer object
    this.customer.vatNumber = this.HQForm.get('vatNumber').value;
    this.customer.name = this.HQForm.get('firstname').value;
    this.customer.officialName = this.HQForm.get('officialname').value;

    if(this.nlegalString !== null && this.nlegalString !== undefined)
      this.customer.legalForm = this.nlegalString;
    else 
    {
      this.customer.legalForm = this.selectedLegalObject.FormName;
    }


    this.customer.phoneNumber = this.phoneNumber;
    this.customer.creditCheck = this.creditCheck;
    this.customer.address = this.address;
    this.customer.email = this.generalEmail;
    this.customer.vcaCertification = this.vcaCertification;
    this.customer.isBlocked = false;

  }

  setStatuteSettingArray() {

    this.invoiceEmail = new EmailAddress();
    this.contractsEmail = new EmailAddress();
    this.statuteSetting = new Array();
    this.statuteSettingObject = new StatuteSetting();
    this.statute = new Statute();
    this.paritairCommitee = new ParitairCommitee();
    this.mealVoucherSettings = new MealVoucherSettings();

    // assigning emailaddress objects
    this.invoiceEmail.emailAddress = this.HQForm.get('invoiceEmail').value;
    this.contractsEmail.emailAddress = this.HQForm.get('contractsEmail').value;

    // assigning statutesettings object
    this.statute.name = "";
    this.paritairCommitee.name = "";
    this.paritairCommitee.number = "";
    this.mealVoucherSettings.employerShare = 0;
    this.mealVoucherSettings.minimumHours = 0;
    this.mealVoucherSettings.totalWorth = 0;

    this.statuteSettingObject.statute = this.statute;
    this.statuteSettingObject.coefficient = 0;
    this.statuteSettingObject.paritairCommitee = this.paritairCommitee;
    this.statuteSettingObject.mealVoucherSettings = this.mealVoucherSettings;

    this.statuteSetting.push(this.statuteSettingObject);
  }

  setInvoiceSettings() {

    this.lieuDaysAllowance = new LieuDaysAllowance();
    this.mobilityAllowance = new MobilityAllowance();
    this.shiftAllowance = new Array();
    this.otherAllowance = new Array();
    this.invoiceSettings = new InvoiceSettings();

    if(this.HQFormData !== null && this.HQFormData !== undefined)    
    if(this.HQFormData.data !== undefined && this.HQFormData.data !== null && this.dpsCustomer !== null && this.HQFormData.data.invoiceSettings !== undefined && this.HQFormData.data.invoiceSettings !== null && this.dpsCustomer !== undefined )
    {

          // assigning invoice settings 
    this.lieuDaysAllowance.enabled =     this.HQFormData.data.invoiceSettings.lieuDaysAllowance.enabled;
    this.lieuDaysAllowance.payed =     this.HQFormData.data.invoiceSettings.lieuDaysAllowance.payed;
    this.mobilityAllowance.amountPerKm =     this.HQFormData.data.invoiceSettings.mobilityAllowance.amountPerKm;
    this.mobilityAllowance.enabled =     this.HQFormData.data.invoiceSettings.mobilityAllowance.enabled;

    this.invoiceSettings.lieuDaysAllowance = this.lieuDaysAllowance;
    this.invoiceSettings.mobilityAllowance = this.mobilityAllowance;

    this.invoiceSettings.holidayInvoiced =     this.HQFormData.data.invoiceSettings.holidayInvoiced;
    this.invoiceSettings.sicknessInvoiced =     this.HQFormData.data.invoiceSettings.sicknessInvoiced;
    this.invoiceSettings.shiftAllowance =     this.HQFormData.data.invoiceSettings.shiftAllowance;

    let lengthOfOtherAllowanceArray = this.HQFormData.data.invoiceSettings.otherAllowances.length;

    for(let count:number=0;count<lengthOfOtherAllowanceArray;count+=1){

      this.otherAllowanceObject = new OtherAllowance(); 

      this.otherAllowanceObject.amount =     this.HQFormData.data.invoiceSettings.otherAllowances[count].amount;
      this.otherAllowanceObject.codeId =     this.HQFormData.data.invoiceSettings.otherAllowances[count].codeId;
      this.otherAllowanceObject.nominal =      this.HQFormData.data.invoiceSettings.otherAllowances[count].nominal;

      this.otherAllowance.push(this.otherAllowanceObject);

    }

    let lengthOfShiftAllowanceArray = this.HQFormData.data.invoiceSettings.shiftAllowances.length;

    for(let i:number=0;i<lengthOfShiftAllowanceArray;i+=1){

      this.shiftAllowanceObject = new ShiftAllowance();

      this.shiftAllowanceObject.amount =     this.HQFormData.data.invoiceSettings.shiftAllowances[i].amount;
      this.shiftAllowanceObject.nominal =    this.HQFormData.data.invoiceSettings.shiftAllowances[i].nominal;
      this.shiftAllowanceObject.timeSpan =     this.HQFormData.data.invoiceSettings.shiftAllowances[i].timeSpan;
      this.shiftAllowanceObject.shiftName =     this.HQFormData.data.invoiceSettings.shiftAllowances[i].shiftName;  
  
      this.shiftAllowance.push(this.shiftAllowanceObject);
  
    }

    this.invoiceSettings.shiftAllowances = this.shiftAllowance;
    this.invoiceSettings.otherAllowances = this.otherAllowance;

    }

    this.HQdata.invoiceSettings = this.invoiceSettings;
  }

  setContacts() {
    this.contact = new Contact();
    this.phoneNumber = new PhoneNumber();
    this.contactsEmail = new EmailAddress();
    this.language = new Language();
    this.contact = new Contact();

    // assigning contacts 
    this.contactsEmail.emailAddress = ""
    this.phoneNumber.number = ""
    this.language.name = ""
    this.language.shortName = "";

    this.contact.firstName = "";
    this.contact.lastName = "";
    this.contact.email = this.contactsEmail;
    this.contact.mobile = this.phoneNumber;
    this.contact.postion = "";
    this.contact.language = this.language;
  }

  setDpsCustomer() {

    this.dpsCustomer = new DPSCustomer();

    //assigning dps customer object
    this.dpsCustomer.customer = this.customer;
    this.dpsCustomer.invoiceEmail = this.invoiceEmail;
    this.dpsCustomer.contractsEmail = this.contractsEmail;
    this.dpsCustomer.invoiceSettings = this.invoiceSettings;
    this.dpsCustomer.statuteSettings = this.statuteSetting;
    this.dpsCustomer.contact = this.contact;

    this.setJsonDataObject();
  }

  getJSONDataObject() {

    if (this.HQdata !== null && this.HQdata !== undefined)
      return this.HQdata;

  }

  validity() {
    if (this.HQForm.valid === true && !this.emptyData() && this.allowCustomer === true)
      return true;

    return false;
  }

  emptyData() {

    if (this.HQForm.get('vatNumber').value === "")
      return true;
    if (this.HQForm.get('firstname').value === "")
      return true;
    if (this.HQForm.get('officialname').value === "")
      return true;
    if (this.HQForm.get('street').value === "")
      return true;
    if (this.HQForm.get('streetnumber').value === "")
      return true;
    if (this.HQForm.get('city').value === "")
      return true;
    if (this.HQForm.get('postalcode').value === "")
      return true;
    if (this.HQForm.get('phonenumber').value === "")
      return true;
    if (this.HQForm.get('invoiceEmail').value === "")
      return true;
    if (this.HQForm.get('contractsEmail').value === "")
      return true;
    if (this.HQForm.get('generalEmail').value === "")
      return true;

    return false;

  }

  setJsonDataObject() {

    if (this.dpsCustomer !== null) {
      this.HQdata = {
        "customer": this.dpsCustomer.customer,
        "invoiceEmail": this.dpsCustomer.invoiceEmail,
        "contractsEmail": this.dpsCustomer.contractsEmail,
        "invoiceSettings": this.dpsCustomer.invoiceSettings,
        "bulkContractsEnabled": false,
        "statuteSettings": this.dpsCustomer.statuteSettings,
        "contact": this.dpsCustomer.contact,
        "activateContactAsUser": false,
        "formValid": true //validity()
      };
      this.sendDatatoHome();
    }
    else
      this.HQdata = null;
  }


  // post the json data
  updateData() {

    this.createObjects();

    //this.childEvent.emit(this.HQdata);

  }

  sendDatatoHome() {
    this.childEvent.emit(this.HQdata);
  }

}
