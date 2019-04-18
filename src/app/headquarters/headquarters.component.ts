import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { CustomersService } from '../shared/customers.service';
import { DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck, 
         PhoneNumber, Address,StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
         LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance, 
         InvoiceSettings, Language, Contact } from '../shared/models';

@Component({
selector: 'app-headquarters',
templateUrl: './headquarters.component.html',
styleUrls: ['./headquarters.component.css']
})

export class HeadquartersComponent implements OnInit {

  public disabled;

  HQdata:any;
  HQForm: FormGroup;

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

  enable:boolean = true;
  change:boolean = false;
  valueChange:boolean = false;
  changeEvent: MouseEvent;
  _isDisabled:boolean = true;

  constructor(private formBuilder:FormBuilder, private customerService: CustomersService) {
          
   }

   onChange(value: boolean) {
    this.change = value;

    if(this.change === true)
      this.HQForm.get('creditLimit').enable();
    else
      this.HQForm.get('creditLimit').disable();

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

    this.checkValidations();  //check validations
   
  }

  


  setCreditCheck() {
    var today = new Date();   
    this.creditCheck = new CreditCheck();

    // assigning credit check object
    this.creditCheck.creditLimit = this.HQForm.get('creditLimit').value;
    this.creditCheck.creditcheck = false;
    this.creditCheck.dateChecked = (today.getMonth()+1) + "/"+ today.getDay() + "/" + today.getFullYear();

  }

  setAddress() {

    this.address = new Address();

      // assigning address object
      this.address.bus = this.HQForm.get('bus').value;
      this.address.city = this.HQForm.get('city').value;
      this.address.country = this.HQForm.get('country').value;
      this.address.countryCode = "";
      this.address.postalCode = this.HQForm.get('postalcode').value;
      this.address.street = this.HQForm.get('street').value;
      this.address.streetNumber = this.HQForm.get('streetnumber').value;
  }

  setCustomerObject() {

    this.customer = new Customer();
    this.generalEmail = new EmailAddress();
    this.vcaCertification = new VcaCertification();
    this.phoneNumber =  new PhoneNumber();

    // assigning vca Object
    this.vcaCertification.cerified = true;

    // assigning general email address object
    this.generalEmail.emailAddress = this.HQForm.get('generalEmail').value;
    
    // assigning customer object
    this.customer.vatNumber = this.HQForm.get('vatNumber').value;
    this.customer.name = this.HQForm.get('firstname').value;
    this.customer.officialName = this.HQForm.get('officialname').value;
    this.customer.legalForm = this.HQForm.get('legalform').value;
    this.customer.phoneNumber = this.HQForm.get('phonenumber').value;
    this.customer.creditCheck = this.creditCheck;
    this.customer.address = this.address;
    this.customer.email = this.generalEmail;
    this.customer.vcaCertification = this.vcaCertification;

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
    this.dpsCustomer.statuteSettings = this.statuteSetting;
    this.dpsCustomer.contact = this.contact;

    this.setJsonDataObject();
  }

  getJSONDataObject() {

    this.checkValidations();

    if(this.HQdata !== null && this.HQdata !== undefined)
    return this.HQdata;

  }

  setJsonDataObject() {    

    if(this.dpsCustomer !== null)
    {
      this.HQdata = {
        "customer": this.dpsCustomer.customer,
        "invoiceEmail": this.dpsCustomer.invoiceEmail,
        "contractsEmail": this.dpsCustomer.contractsEmail,
        "bulkContractsEnabled": false,
        "statuteSettings": this.dpsCustomer.statuteSettings,
        "contacts": this.dpsCustomer.contact
      };
    }
    else
     this.HQdata = null;
  }

  checkValidations() {

    this.validated = true;

    //all fields are validated
    if(this.validated) 
    {
      this.setCreditCheck();
      this.setAddress();
      this.setCustomerObject();
      this.setStatuteSettingArray();
      this.setInvoiceSettings();
      this.setContacts();
      this.setDpsCustomer();
    }
  }

  // post the json data
  postData() {

    this.checkValidations();

    console.log(this.HQdata);
    console.log("json="+this.HQdata);

    // if(this.HQdata !== undefined && this.HQdata !== null)
    // {
    //   this.customerService.createCustomer(this.HQdata).subscribe(res =>{
    //     console.log("response="+res);
    //   },
    //    (err:HttpErrorResponse) => {
    //      if(err.error instanceof Error)
    //      {
    //        console.log("Error occured="+err.error.message);
    //      }
    //      else {
    //        console.log("response code="+err.status);
    //        console.log("response body="+err.error);
    //      }
    //    }
    //   );  
    // }

  }

}
