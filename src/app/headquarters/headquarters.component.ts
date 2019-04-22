import { Component, OnInit,Input,Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { CustomersService } from '../shared/customers.service';
import { DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck, 
         PhoneNumber, Address,StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
         LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance, 
         InvoiceSettings, Language, Contact } from '../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { LegalComponent } from '../../app/componentcontrols/legal/legal.component';
import { ChildActivationEnd } from '@angular/router';

@Component({
selector: 'app-headquarters',
templateUrl: './headquarters.component.html',
styleUrls: ['./headquarters.component.css']
})

export class HeadquartersComponent implements OnInit {

  @ViewChild(LegalComponent) legalComponent;

  public legalString;
  public countryString;
  public countryCode;

  @Input() public HQFormData;
  @Output() public childEvent = new EventEmitter();

  public disabled;
  public ErrorResponseMessage;

  HQdata:any;
  HQForm: FormGroup;
  getCustomersByvatNumberResponse: any;
  getCustomersByvatNumberErrorMessage: string;

  dpsCustomer:DPSCustomer;
  customer: Customer;

  generalEmail:EmailAddress;
  invoiceEmail:EmailAddress;
  contractsEmail:EmailAddress;
  contactsEmail:EmailAddress;

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
  validated:Boolean;

  numberPattern:string;
  vatNumber:string;
  creditCheckLimit:number;


  enable:boolean = true;
  change:boolean = false;
  valueChange:boolean = false;
  changeEvent: MouseEvent;
  _isDisabled:boolean = true;

  ngAfterViewInit(){
    this.legalString = this.legalComponent.selectedString;
  }
 

  ngOnInit() {

    this.HQForm = new FormGroup({
      vatNumber: new FormControl('',[Validators.required,Validators.minLength(12), Validators.pattern("^[0-9]+$")]),
      firstname: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      officialname: new FormControl('',[Validators.required,Validators.pattern("^[A-Za-z]+$")]),
      creditCheck:new FormControl(),
      legalform:new FormControl('',Validators.required),
      creditLimit:new FormControl(),
      street:new FormControl('',[Validators.required,Validators.pattern("^[A-Za-z ]+$")]),
      streetnumber:new FormControl('',[Validators.required,Validators.pattern("^[0-9]+$")]),
      bus:new FormControl('',Validators.pattern("^[0-9]+$")),
      city:new FormControl('',[Validators.required,Validators.pattern("^[A-Za-z]+$")]),
      postalcode:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]+$")]),
      country:new FormControl('',[Validators.required,Validators.pattern("^[A-Za-z]+$")]),
      phonenumber:new FormControl('',[Validators.required]),
      telephone:new FormControl('',[Validators.required]),
      invoiceEmail:new FormControl('',[Validators.required,Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")]),
      contractsEmail:new FormControl('',[Validators.required,Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")]),
      generalEmail:new FormControl('',[Validators.required,Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")])
    });

    this.HQForm.get('creditLimit').disable();

    this.createObjects();  //check validations    
   
  }

  constructor(private formBuilder:FormBuilder, private customerService: CustomersService) {
          
   }


   createObjects() {

    //all fields are validated
      this.setCreditCheck();
      this.setAddress();
      this.setCustomerObject();
      this.setStatuteSettingArray();
      this.setInvoiceSettings();
      this.setContacts();
      this.setDpsCustomer();

  }

  receiveMessage($event){
    this.legalString = $event;
    this.setCustomerObject();
    this.createObjects();
  }

  receiveMessageCountry($event){

    console.log("recevied event");
    console.log($event);
    this.countryString = $event.countryName;
    this.countryCode = $event.countryCode;
    this.setAddress();
    this.setCustomerObject();
    this.createObjects();

  }

   creditLimitApi() {

    this.vatNumber = this.HQForm.get('vatNumber').value;

    if(this.HQForm.get('vatNumber').valid === true)    
       this.getCustomerByVatNumber(this.vatNumber);

   }

    // response Codes: 
    // 400 vat number isn't valid 
    // 204 no record not allowed to create customer
    // 200 allow to create customer
    // 409 Customer already in the system dont allow to create new customer

   getCustomerByVatNumber(vatNumber:string) {

    let response:DPSCustomer;

    this.customerService.getCustomersByVatNumber(vatNumber)
    .subscribe(data => {
      response = data;
      console.log(response);

      this.parseData(response);
    },error => this.handleError(error));

   }

   handleError(errorMessage:HttpErrorResponse) {

    if(errorMessage.status === 400)    
      this.ErrorResponseMessage = "Btw-nummer is niet in correct formaat";
    if(errorMessage.status === 204)    
      this.ErrorResponseMessage = "Geen record in ons systeem";      
    if(errorMessage.status === 409)    
      this.ErrorResponseMessage = "Klant met vatnummer bestaat al";      

   }

   creditLimit(value:number) {
    this.HQForm.controls['creditLimit'].setValue(value);
  }


   parseData(response:DPSCustomer){

    let creditCheckboolean:boolean = response.customer.creditCheck.creditcheck;
     this.creditCheckLimit = response.customer.creditCheck.creditLimit;

    console.log("creditchekc="+creditCheckboolean);
      
    if(creditCheckboolean === true)
      this.creditLimit(this.creditCheckLimit);
    else
    {
      this.creditLimit(this.creditCheckLimit);
    }

   }

   onChange(value: boolean) {
      this.change = value;
    
      this.HQForm.get('creditLimit').disable();

      if(this.change === true)
        this.creditLimit(3004);
      else
        this.creditLimit(0);

    console.log("this.change="+this.change);
  }

  onChangeEvent(event: MouseEvent) {
    console.log(event, event.toString(), JSON.stringify(event));
    this.changeEvent = event;
  }

  onValueChange(value: boolean) {
    this.valueChange = value;
    console.log("valuechange="+this.valueChange);
  }


  set isDisabled(value: boolean) {
    this._isDisabled = value;
    if(value) {
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
    this.creditCheck.creditLimit = this.creditCheckLimit;
    this.creditCheck.creditcheck = false;
    this.creditCheck.creditCheckPending = false;
    this.creditCheck.dateChecked = (today.getMonth()+1) + "/"+ today.getDay() + "/" + today.getFullYear();

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

    console.log("setting customer object with legalform="+this.legalString);
    console.log(this.legalString);

    this.customer = new Customer();
    this.generalEmail = new EmailAddress();
    this.vcaCertification = new VcaCertification();
    this.phoneNumber =  new PhoneNumber();

    // assigning vca Object
    this.vcaCertification.cerified = true;

    // assigning general email address object
    this.generalEmail.emailAddress = this.HQForm.get('generalEmail').value;

    this.phoneNumber.number = this.HQForm.get('phonenumber').value;
    
    // assigning customer object
    this.customer.vatNumber = this.HQForm.get('vatNumber').value;
    this.customer.name = this.HQForm.get('firstname').value;
    this.customer.officialName = this.HQForm.get('officialname').value;
    this.customer.legalForm = this.legalString;
    this.customer.phoneNumber = this.phoneNumber;
    this.customer.creditCheck = this.creditCheck;
    this.customer.address = this.address;
    this.customer.email = this.generalEmail;
    this.customer.vcaCertification = this.vcaCertification;
    this.customer.isBlocked = false;

    console.log(this.customer);
  }

  setStatuteSettingArray() {

    this.invoiceEmail = new EmailAddress();
    this.contractsEmail = new EmailAddress();
    this.statuteSetting =  new Array();
    this.statuteSettingObject = new StatuteSetting();
    this.statute =  new Statute();
    this.paritairCommitee =  new ParitairCommitee();
    this.mealVoucherSettings =  new MealVoucherSettings();

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

      this.lieuDaysAllowance = new  LieuDaysAllowance;
      this.mobilityAllowance =  new MobilityAllowance();
      this.shiftAllowance =  new Array();
      this.otherAllowance = new Array();
      this.otherAllowanceObject = new OtherAllowance();
      this.shiftAllowanceObject = new ShiftAllowance();
      this.invoiceSettings = new InvoiceSettings();

      // assigning invoice settings 
      this.lieuDaysAllowance.enabled = false;
      this.lieuDaysAllowance.payed = false;
      this.mobilityAllowance.amountPerKm = 0;
      this.mobilityAllowance.enabled = false;

      this.shiftAllowanceObject.amount = 9.3;
      this.shiftAllowanceObject.nominal = false;
      this.shiftAllowanceObject.timeSpan = "";
      this.shiftAllowanceObject.shiftName = "";

      this.otherAllowanceObject.amount = 9.4;
      this.otherAllowanceObject.codeId = "";
      this.otherAllowanceObject.nominal = false;

      this.shiftAllowance.push(this.shiftAllowanceObject);
      this.otherAllowance.push(this.otherAllowanceObject);

      this.invoiceSettings.holidayInvoiced = false;
      this.invoiceSettings.sicknessInvoiced = false;
      this.invoiceSettings.shiftAllowance = false;
      this.invoiceSettings.lieuDaysAllowance = this.lieuDaysAllowance;
      this.invoiceSettings.mobilityAllowance = this.mobilityAllowance;
      this.invoiceSettings.shiftAllowances = this.shiftAllowance;
      this.invoiceSettings.otherAllowances = this.otherAllowance;
  }

  setContacts() {
      this.contact = new Contact();
      this.phoneNumber =  new PhoneNumber();
      this.contactsEmail = new EmailAddress();
      this.language = new Language();
      this.contact = new Contact();

      // assigning contacts 
      this.contactsEmail.emailAddress = ""
      this.phoneNumber.number =""
      this.language.name = ""
      this.language.shortName = "";

      this.contact.firstName =  "";
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

    if(this.HQdata !== null && this.HQdata !== undefined)
    return this.HQdata;

  }

  validity(){
    if(this.HQForm.valid === true && !this.emptyData() )
      return true;

    return false;
  }

  emptyData() {


    if(this.HQForm.get('vatNumber').value === "")
      return true;
    if(this.HQForm.get('firstname').value === "")
      return true;
    if(this.HQForm.get('officialname').value === "")
      return true;
    if(this.HQForm.get('creditCheck').value === "")
    return true;
    if(this.HQForm.get('legalform').value === "")
    return true;
    if(this.HQForm.get('creditLimit').value === "")
    return true;
    if(this.HQForm.get('street').value === "")
    return true;
    if(this.HQForm.get('streetnumber').value === "")
    return true;
    if(this.HQForm.get('city').value === "")
    return true;
    if(this.HQForm.get('postalcode').value === "")
    return true;
    if(this.HQForm.get('country').value === "")
    return true;
    if(this.HQForm.get('phonenumber').value === "")
    return true;
    if(this.HQForm.get('telephone').value === "")
    return true;
    if(this.HQForm.get('invoiceEmail').value === "")
    return true;
    if(this.HQForm.get('contractsEmail').value === "")
    return true;
    if(this.HQForm.get('generalEmail').value === "")
    return true;

    return false;

  }

  setJsonDataObject() {    

    if(this.dpsCustomer !== null)
    {
      this.HQdata = {
        "customer": this.dpsCustomer.customer,
        "invoiceEmail": this.dpsCustomer.invoiceEmail,
        "contractsEmail": this.dpsCustomer.contractsEmail,
        "invoiceSettings": this.dpsCustomer.invoiceSettings,
        "bulkContractsEnabled": false,
        "statuteSettings": this.dpsCustomer.statuteSettings,
        "contacts": this.dpsCustomer.contact,
        "formValid": this.validity()
      };
      this.sendDatatoHome();
    }
    else
     this.HQdata = null;
  }


  // post the json data
  updateData() {

    console.log(this.HQdata);
    console.log("json="+this.HQdata);
    this.createObjects();

    this.childEvent.emit(this.HQdata);

  }

  sendDatatoHome() {
    this.childEvent.emit(this.HQdata);
  }

}
