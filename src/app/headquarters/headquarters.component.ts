import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomersService } from '../shared/customers.service';
import {
  DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck,
  PhoneNumber, Address, StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance,
  InvoiceSettings, Language, Contact, LoginToken
} from '../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LegalComponent } from '../../app/componentcontrols/legal/legal.component';
import { ChildActivationEnd, ActivatedRoute, Router } from '@angular/router';
import { load } from '@angular/core/src/render3';
import { TimeSpan } from '../shared/TimeSpan';
import { DataService } from '../../../src/app/shared/data.service';
import { MatDialog } from '@angular/material';
import { LoggingService } from '../shared/logging.service';


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
  public changeDpsCustomer;

  @Input() public HQFormData;
  @Output() public childEvent = new EventEmitter();

  public oldData: any = {};
  public disabled;
  public ErrorResponseMessage;

  public creditcheckEdit: boolean = false;

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
  validated: boolean;

  creditCheckboolean: boolean;
  creditCheckPending: boolean;

  numberPattern: string;
  vatNumber: string;
  creditCheckLimit: number;

  allowCustomer: boolean;

  enable: boolean = true;
  change: boolean = false;
  valueChange: boolean = false;
  changeEvent: MouseEvent;
  _isDisabled: boolean = true;

  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public Id = '';
  public currentPage = '';

  public EditdataFromComponents;
  public selectedLegalObject: any = { 'FormName': 'NV' };

  // ngAfterViewInit(){
  //   //this.legalString = this.legalComponent.selectedString;
  // }

  ngDoCheck() {

    //load Edit Page details
    if (this.oldData !== this.HQFormData) {
      if (this.HQFormData !== undefined && this.HQFormData.data !== null && this.HQFormData.page === 'edit') {
        // this.clearFields();
        this.oldData = this.HQFormData;
        this.loadDataEdit(this.HQFormData.data);
        this.updateDataEdit();
      }
    }
  }

  ngOnInit() {
    
    this.HQForm = new FormGroup({
      vatNumber: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[a-zA-Z0-9]+$')]),
      firstname: new FormControl('', [Validators.required]),
      officialname: new FormControl('', [Validators.required]),
      creditCheck: new FormControl(),
      legalform: new FormControl(),
      creditLimit: new FormControl(),
      street: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]),
      streetnumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      bus: new FormControl(''),
      city: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]),
      postalcode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]),
      country: new FormControl(''),
      phonenumber: new FormControl('', Validators.required),
      invoiceEmail: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
      contractsEmail: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
      generalEmail: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])
    });

    this.HQForm.get('creditLimit').disable();
    // this.HQForm.get('vatNumber').disable();
    this.allowCustomer = false;
    //this.legalString = "BVBA";
    this.createObjects();  //check validations

    if (localStorage.getItem('dpsLoginToken') !== undefined &&
      localStorage.getItem('dpsLoginToken') !== '' &&
      localStorage.getItem('dpsLoginToken') !== null) {
      const sub = this.route.params.subscribe((params: any) => {
        this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
        this.Id = params.id;
        this.currentPage = params.page;
      });
    } else {
      // this.logger.log('localStorage.getItem("dpsLoginToken") not found.', this.dpsLoginToken);
      // // this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');

      // this.logger.log('Redirect Breaked 9');
      // //this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }

  }

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggingService,
    private data: DataService) {
  }

  ngAfterViewInit() {

    //load Edit Page details
    if (this.HQFormData !== null && this.HQFormData !== undefined && this.oldData !== this.HQFormData) {
      if (this.HQFormData !== undefined && this.HQFormData.data !== '' && this.HQFormData.page === 'edit') {
        this.oldData = this.HQFormData;
        this.loadDataEdit(this.HQFormData.data);
        this.updateDataEdit();
      }
    }

  }


  loadDataEdit(dpscustomer: any) {

    this.logger.log("hq form data");
    this.logger.log(this.HQFormData.data);

    if (dpscustomer !== null) {

      if (dpscustomer.customer !== null && dpscustomer.customer !== undefined) {

        this.HQForm.controls['vatNumber'].setValue(dpscustomer.customer.vatNumber);
        this.HQForm.controls['vatNumber'].disable();
        this.HQForm.controls['firstname'].setValue(dpscustomer.customer.name);
        this.HQForm.controls['officialname'].setValue(dpscustomer.customer.officialName);

        if (dpscustomer.customer.creditCheck !== null && dpscustomer.customer.creditCheck !== undefined) {
          this.HQForm.controls['creditLimit'].setValue(dpscustomer.customer.creditCheck.creditLimit);
          this.creditcheckEdit = dpscustomer.customer.creditCheck.creditcheck;
          this.creditCheckPending = dpscustomer.customer.creditCheck.creditCheckPending;
        }

        this.legalString = dpscustomer.customer.legalForm;

        if (dpscustomer.customer.address !== null && dpscustomer.customer.address !== undefined) {
          this.HQForm.controls['street'].setValue(dpscustomer.customer.address.street);
          this.HQForm.controls['streetnumber'].setValue(dpscustomer.customer.address.streetNumber);
          this.HQForm.controls['bus'].setValue(dpscustomer.customer.address.bus);
          this.HQForm.controls['city'].setValue(dpscustomer.customer.address.city);
          this.HQForm.controls['postalcode'].setValue(dpscustomer.customer.address.postalCode);

          this.countryString = dpscustomer.customer.address.country;
        }

        this.HQForm.controls['phonenumber'].setValue(dpscustomer.customer.phoneNumber.number);
        this.HQForm.controls['generalEmail'].setValue(dpscustomer.customer.email.emailAddress);

        if (dpscustomer.contractsEmail !== null && dpscustomer.contractsEmail !== undefined)
          this.HQForm.controls['contractsEmail'].setValue(dpscustomer.contractsEmail.emailAddress);

        if (dpscustomer.invoiceEmail !== null && dpscustomer.invoiceEmail !== undefined)
          this.HQForm.controls['invoiceEmail'].setValue(dpscustomer.invoiceEmail.emailAddress);


        // this.invoiceSettings = new InvoiceSettings();
        // this.invoiceSettings = dpscustomer.invoiceSettings;

        // this.HQdata.invoiceSettings = dpscustomer.invoiceSettings;
      }

    }

  }


  checkValidation() {
    if (this.HQForm.get('vatNumber').valid === true &&
      this.HQForm.get('firstname').valid === true &&
      this.HQForm.get('officialname').valid === true &&
      this.HQForm.get('street').valid === true &&
      this.HQForm.get('streetnumber').valid === true &&
      this.HQForm.get('city').valid === true &&
      this.HQForm.get('postalcode').valid === true &&
      this.HQForm.get('phonenumber').valid === true &&
      this.HQForm.get('invoiceEmail').valid === true &&
      this.HQForm.get('contractsEmail').valid === true &&
      // this.allowCustomer === true &&
      this.HQForm.get('generalEmail').valid === true) {
      console.log('form valid');
      return true;
    }
    else {
      console.log('form not valid');
      console.log('vatnumber=' + this.HQForm.get('vatNumber').valid);
      console.log('firstname=' + this.HQForm.get('firstname').valid);
      console.log('name=' + this.HQForm.get('officialname').valid);
      console.log('street=' + this.HQForm.get('street').valid);
      console.log('streetnumber=' + this.HQForm.get('streetnumber').valid);
      console.log('city=' + this.HQForm.get('city').valid);
      console.log('postalcode=' + this.HQForm.get('postalcode').valid);
      console.log('phonenumber=' + this.HQForm.get('phonenumber').valid);
      console.log('invoiceEmail=' + this.HQForm.get('invoiceEmail').valid);
      console.log('contractsEmail=' + this.HQForm.get('contractsEmail').valid);
      console.log('generalEmail=' + this.HQForm.get('generalEmail').valid);

    }

    return false;
  }



  createObjectsEdit() {

    if (this.creditCheck === null) {
      this.setCreditCheck();
    }

    this.setCustomerObjectEdit();
  }

  setCustomerObjectEdit() {

    this.address = new Address();

    // assigning address object
    this.address.bus = this.HQForm.get('bus').value;
    this.address.city = this.HQForm.get('city').value;
    this.address.country = this.countryString;
    this.address.countryCode = this.countryCode;
    this.address.postalCode = this.HQForm.get('postalcode').value;
    this.address.street = this.HQForm.get('street').value;
    this.address.streetNumber = this.HQForm.get('streetnumber').value;

    this.customer = new Customer();
    this.generalEmail = new EmailAddress();
    this.vcaCertification = new VcaCertification();
    this.phoneNumber = new PhoneNumber();

    // assigning vca Object
    this.vcaCertification.cerified = false;

    // assigning general email address object
    this.generalEmail.emailAddress = this.HQForm.get('generalEmail').value;
    this.phoneNumber.number = this.HQForm.get('phonenumber').value;

    // assigning customer object
    this.customer.vatNumber = this.HQForm.get('vatNumber').value;
    this.customer.name = this.HQForm.get('firstname').value;
    this.customer.officialName = this.HQForm.get('officialname').value;

    if (this.nlegalString !== null && this.nlegalString !== undefined)
      this.customer.legalForm = this.nlegalString;
    else {
      this.customer.legalForm = this.selectedLegalObject.FormName;
    }

    var today = new Date();
    this.customer.creditCheck = new CreditCheck();

    // assigning credit check object
    this.customer.creditCheck.creditLimit = this.HQForm.get('creditLimit').value;
    this.customer.creditCheck.creditcheck = this.creditcheckEdit;
    this.customer.creditCheck.creditCheckPending = this.creditCheckPending;
    this.customer.creditCheck.dateChecked = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

    this.customer.phoneNumber = this.phoneNumber;
    this.customer.address = this.address;
    this.customer.email = this.generalEmail;
    this.customer.vcaCertification = this.vcaCertification;
    this.customer.isBlocked = false;
    

    this.changeDpsCustomer = new DPSCustomer();

    if(this.customer !== null && this.customer !== undefined)
    {
        //assigning dps customer object
        this.changeDpsCustomer.customer = this.customer;
        this.changeDpsCustomer.invoiceEmail = this.invoiceEmail;
        this.changeDpsCustomer.contractsEmail = this.contractsEmail;

        console.log("setting DPS  EDIT Customer");
        console.log(this.changeDpsCustomer);
    }
  
  }
  
  createObjects() {

    //all fields are validated
    //this.setCreditCheck();

    if (this.creditCheck === null) {
      this.setCreditCheck();
    }

    this.setAddress();
    this.setCustomerObject();
    //this.setStatuteSettingArray();
    //this.setContacts();
    this.setDpsCustomer();
    //this.setInvoiceSettings();
  }

  receiveMessage($event) {
    this.nlegalString = $event;
    this.selectedLegalObject = { 'FormName': $event };
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

    this.creditcheckEdit = false;
    this.creditCheckPending = false;
    this.HQForm.get('creditLimit').setValue('');

    if (this.HQForm.get('vatNumber').valid === true) {
      this.getCustomerByVatNumber(this.vatNumber);
    }
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

    // this.logger.ShowMessage("Klant met vatnummer bestaat al",'');

    console.log('there is an error with api call to getCustomersbyVatNumber', errorMessage);

    this.allowCustomer = false;

    if (errorMessage.status === 404) {
      this.logger.ShowMessage('Btw-nummer staat niet in ons systeem', '',4000);
      this.HQForm.controls['vatNumber'].setValue('');
    }

    if (errorMessage.status === 400) {
      this.logger.ShowMessage('Btw-nummer is niet in correct formaat', '',4000);
      this.HQForm.controls['vatNumber'].setValue('');
    }

    if (errorMessage.status === 204) {
      this.logger.ShowMessage('Geen record in ons systeem', '',4000);
      this.HQForm.controls['vatNumber'].setValue('');
    }
    if (errorMessage.status === 409) {
      console.log('error conflict 409');
      this.logger.ShowMessage('Klant met vatnummer bestaat al', '',4000);
      this.router.navigate(['/' + 'customer/' + this.HQForm.get('vatNumber').value]);
    }
    if (errorMessage.status === 500) {
      console.log('System Error', errorMessage);
      this.logger.ShowMessage('Interne Server Fout', '',4000);
      this.HQForm.controls['vatNumber'].setValue('');
    }

  }

  updateFirstName(firstname: string) {
    this.HQForm.controls['firstname'].setValue(firstname);
  }

  updateLastName(lastname: string) {
    this.HQForm.controls['lastname'].setValue(lastname);
  }

  clearError() {
    this.ErrorResponseMessage = '';
  }

  creditLimit(value: number) {
    this.HQForm.controls['creditLimit'].setValue(value);
  }


  parseData(response: DPSCustomer) {

    this.loadData(response);

    if (response.customer.creditCheck !== undefined && response.customer.creditCheck !== null) {
      this.creditCheckboolean = response.customer.creditCheck.creditcheck;
      this.creditCheckPending = response.customer.creditCheck.creditCheckPending;
      this.creditCheckLimit = response.customer.creditCheck.creditLimit;
      this.creditcheckEdit = response.customer.creditCheck.creditcheck;

      var today = new Date();
      this.creditCheck = new CreditCheck();

      // assigning credit check object
      this.creditCheck.creditLimit = this.creditCheckLimit; //this.creditCheckLimit;
      this.creditCheck.creditcheck = this.creditCheckboolean;
      this.creditCheck.creditCheckPending = this.creditCheckPending;
      this.creditCheck.dateChecked = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

      if (this.creditCheckboolean === true)
        this.creditLimit(this.creditCheckLimit);
      else {
        this.creditLimit(this.creditCheckLimit);
      }

    }
  }

  clearFields() {
    this.HQForm.controls['firstname'].setValue('');
    this.HQForm.controls['officialname'].setValue('');
    this.HQForm.controls['street'].setValue('');
    this.HQForm.controls['streetnumber'].setValue('');
    this.HQForm.controls['bus'].setValue('');
    this.HQForm.controls['city'].setValue('');
    this.HQForm.controls['postalcode'].setValue('');
    this.HQForm.controls['country'].setValue('');
    this.HQForm.controls['phonenumber'].setValue('');
    this.HQForm.controls['generalEmail'].setValue('');
    this.HQForm.controls['invoiceEmail'].setValue('');
    this.HQForm.controls['contractsEmail'].setValue('');

  }


  loadData(verifiedCustomerData: any) {

    console.log('customer data');
    console.log(verifiedCustomerData);

    if (verifiedCustomerData !== null) {
      if (verifiedCustomerData.customer !== null) {

        this.HQForm.controls['firstname'].setValue(verifiedCustomerData.customer.name);
        this.HQForm.controls['officialname'].setValue(verifiedCustomerData.customer.officialName);
        // this.HQForm.controls['legalForm'].setValue(verifiedCustomerData.customer.legalForm); // dropdown value

        this.legalString = verifiedCustomerData.customer.legalForm;

        if (verifiedCustomerData.customer.address !== null) {
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
    this.creditCheck.creditLimit = 0;
    this.creditCheck.creditcheck = this.creditcheckEdit;
    this.creditCheck.creditCheckPending = false;
    this.creditCheck.dateChecked = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

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
    this.vcaCertification.cerified = false;

    // assigning general email address object
    this.generalEmail.emailAddress = this.HQForm.get('generalEmail').value;
    this.phoneNumber.number = this.HQForm.get('phonenumber').value;

    // assigning customer object
    this.customer.vatNumber = this.HQForm.get('vatNumber').value;
    this.customer.name = this.HQForm.get('firstname').value;
    this.customer.officialName = this.HQForm.get('officialname').value;

    if (this.nlegalString !== null && this.nlegalString !== undefined)
      this.customer.legalForm = this.nlegalString;
    else {
      this.customer.legalForm = this.selectedLegalObject.FormName;
    }

    var today = new Date();
    this.customer.creditCheck = new CreditCheck();

    // assigning credit check object
    this.customer.creditCheck.creditLimit = this.HQForm.get('creditLimit').value;
    this.customer.creditCheck.creditcheck = this.creditcheckEdit;
    this.customer.creditCheck.creditCheckPending = this.creditCheckPending;
    this.customer.creditCheck.dateChecked = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

    this.customer.phoneNumber = this.phoneNumber;
    this.customer.address = this.address;
    this.customer.email = this.generalEmail;
    this.customer.vcaCertification = this.vcaCertification;
    this.customer.isBlocked = false;
    

  }

  setStatuteSettingArray() {
    
    this.statuteSetting = new Array();
    this.statuteSettingObject = new StatuteSetting();
    this.statute = new Statute();
    this.paritairCommitee = new ParitairCommitee();
    this.mealVoucherSettings = new MealVoucherSettings();

    // assigning statutesettings object
    this.statute.name = '';
    this.statute.type = '';
    this.statute.brightStaffingID = 0;

    this.paritairCommitee.name = '';
    this.paritairCommitee.number = '';
    this.mealVoucherSettings.employerShare = 0;
    this.mealVoucherSettings.minimumHours = 0;
    this.mealVoucherSettings.totalWorth = 0;

    this.statuteSettingObject.statute = this.statute;
    this.statuteSettingObject.coefficient = 3.5;
    this.statuteSettingObject.paritairCommitee = this.paritairCommitee;
    this.statuteSettingObject.mealVoucherSettings = this.mealVoucherSettings;



    this.statuteSetting.push(this.statuteSettingObject);
  }

  setInvoiceSettingsEmpty() {

    this.lieuDaysAllowance = new LieuDaysAllowance();
    this.mobilityAllowance = new MobilityAllowance();

    this.shiftAllowance = new Array();
    this.otherAllowance = new Array();

    this.invoiceSettings = new InvoiceSettings();

    this.invoiceSettings.mobilityAllowance = new MobilityAllowance();
    this.invoiceSettings.mobilityAllowance.amountPerKm = 0;
    this.invoiceSettings.mobilityAllowance.enabled = false;

    this.invoiceSettings.lieuDaysAllowance = new LieuDaysAllowance();
    this.invoiceSettings.lieuDaysAllowance.enabled = false;
    this.invoiceSettings.lieuDaysAllowance.payed = false;

    this.invoiceSettings.holidayInvoiced = false;
    this.invoiceSettings.sicknessInvoiced = false;

    this.invoiceSettings.shiftAllowances = new Array();
    this.invoiceSettings.otherAllowances = new Array();

    let lengthOfOtherAllowanceArray = 1;

    for (let count: number = 0; count < lengthOfOtherAllowanceArray; count += 1) {
      this.otherAllowanceObject = new OtherAllowance();

      this.otherAllowanceObject.amount = 0;
      this.otherAllowanceObject.codeId = 0;
      this.otherAllowanceObject.nominal = false;

      this.invoiceSettings.otherAllowances.push(this.otherAllowanceObject);
    }

    let lengthOfShiftAllowanceArray = 1;

    for (let i: number = 0; i < lengthOfShiftAllowanceArray; i += 1) {

      this.shiftAllowanceObject = new ShiftAllowance();

      this.shiftAllowanceObject.amount = 0;
      this.shiftAllowanceObject.nominal = false;
      this.shiftAllowanceObject.timeSpan = "";
      this.shiftAllowanceObject.shiftName = "";

      this.invoiceSettings.shiftAllowances.push(this.shiftAllowanceObject);

    }

    this.invoiceSettings.shiftAllowance = false;
    this.invoiceSettings.otherAllowance = false;

    this.invoiceSettings.transportCoefficient = 1.20;
    this.invoiceSettings.dimonaCost = 0.3510;
    this.invoiceSettings.ecoCoefficient = 1.69;
    this.invoiceSettings.mealvoucherCoefficient = 1.69;

  }

  setInvoiceSettings() {

    this.lieuDaysAllowance = new LieuDaysAllowance();
    this.mobilityAllowance = new MobilityAllowance();
    this.shiftAllowance = new Array();
    this.otherAllowance = new Array();
    this.invoiceSettings = new InvoiceSettings();

    if (this.HQFormData !== null && this.HQFormData !== undefined) {
      if (this.HQFormData.data !== undefined && this.HQFormData.data !== null && this.dpsCustomer !== null && this.HQFormData.data.invoiceSettings !== undefined && this.HQFormData.data.invoiceSettings !== null && this.dpsCustomer !== undefined) {
        if (this.HQFormData.data.invoiceSettings.mobilityAllowance !== null && this.HQFormData.data.invoiceSettings.mobilityAllowance !== undefined) {
          this.mobilityAllowance.amountPerKm = this.HQFormData.data.invoiceSettings.mobilityAllowance.amountPerKm;
          this.mobilityAllowance.enabled = this.HQFormData.data.invoiceSettings.mobilityAllowance.enabled;
          this.invoiceSettings.mobilityAllowance = this.mobilityAllowance;
        }

        if (this.HQFormData.data.invoiceSettings.lieuDaysAllowance !== null && this.HQFormData.data.invoiceSettings.lieuDaysAllowance !== undefined) {
          // assigning invoice settings 
          this.lieuDaysAllowance.enabled = this.HQFormData.data.invoiceSettings.lieuDaysAllowance.enabled;
          this.lieuDaysAllowance.payed = this.HQFormData.data.invoiceSettings.lieuDaysAllowance.payed;
          this.invoiceSettings.lieuDaysAllowance = this.lieuDaysAllowance;
        }

        this.invoiceSettings.holidayInvoiced = this.HQFormData.data.invoiceSettings.holidayInvoiced;
        this.invoiceSettings.sicknessInvoiced = this.HQFormData.data.invoiceSettings.sicknessInvoiced;
        this.invoiceSettings.shiftAllowance = this.HQFormData.data.invoiceSettings.shiftAllowance;

        let lengthOfOtherAllowanceArray = 0;
        if (this.HQFormData.data.invoiceSettings.otherAllowances !== null && this.HQFormData.data.invoiceSettings.otherAllowances !== undefined)
          lengthOfOtherAllowanceArray = this.HQFormData.data.invoiceSettings.otherAllowances.length;

        for (let count: number = 0; count < lengthOfOtherAllowanceArray; count += 1) {
          this.otherAllowanceObject = new OtherAllowance();

          this.otherAllowanceObject.amount = this.HQFormData.data.invoiceSettings.otherAllowances[count].amount;
          this.otherAllowanceObject.codeId = this.HQFormData.data.invoiceSettings.otherAllowances[count].codeId;
          this.otherAllowanceObject.nominal = this.HQFormData.data.invoiceSettings.otherAllowances[count].nominal;

          this.otherAllowance.push(this.otherAllowanceObject);
        }

        let lengthOfShiftAllowanceArray = 0;

        if (this.HQFormData.data.invoiceSettings.shiftAllowances !== null && this.HQFormData.data.invoiceSettings.shiftAllowances !== undefined)
          lengthOfShiftAllowanceArray = this.HQFormData.data.invoiceSettings.shiftAllowances.length;

        for (let i: number = 0; i < lengthOfShiftAllowanceArray; i += 1) {

          this.shiftAllowanceObject = new ShiftAllowance();

          this.shiftAllowanceObject.amount = this.HQFormData.data.invoiceSettings.shiftAllowances[i].amount;
          this.shiftAllowanceObject.nominal = this.HQFormData.data.invoiceSettings.shiftAllowances[i].nominal;
          this.shiftAllowanceObject.timeSpan = this.HQFormData.data.invoiceSettings.shiftAllowances[i].timeSpan;
          this.shiftAllowanceObject.shiftName = this.HQFormData.data.invoiceSettings.shiftAllowances[i].shiftName;

          this.shiftAllowance.push(this.shiftAllowanceObject);

        }

        this.invoiceSettings.shiftAllowances = this.shiftAllowance;
        this.invoiceSettings.otherAllowances = this.otherAllowance;

      }
      this.HQdata.invoiceSettings = this.invoiceSettings;
    }

  }

  setContacts() {
    this.contact = new Contact();
    this.phoneNumber = new PhoneNumber();
    this.contactsEmail = new EmailAddress();
    this.language = new Language();
    this.contact = new Contact();

    // assigning contacts 
    this.contactsEmail.emailAddress = ''
    this.phoneNumber.number = ''
    this.language.name = ''
    this.language.shortName = '';

    this.contact.firstName = '';
    this.contact.lastName = '';
    this.contact.email = this.contactsEmail;
    this.contact.mobile = this.phoneNumber;
    this.contact.postion = '';
    this.contact.language = this.language;
  }

  setDpsCustomer() {

    this.dpsCustomer = new DPSCustomer();

    if(this.customer !== null && this.customer !== undefined)
    {
        //assigning dps customer object
        this.dpsCustomer.customer = this.customer;
        this.dpsCustomer.invoiceEmail = this.invoiceEmail;
        this.dpsCustomer.contractsEmail = this.contractsEmail;
        // this.dpsCustomer.contact = this.contact;

        console.log("setting DPS Customer");
        console.log(this.dpsCustomer);

        this.setJsonDataObject();
    }

  }

  getJSONDataObject() {

    if (this.HQdata !== null && this.HQdata !== undefined)
      return this.HQdata;

  }

  validity() {
    // && this.allowCustomer === true

    if (this.HQForm.valid === false && this.HQForm.get('bus').value === '' && !this.emptyData())
      return true;

    if (this.HQForm.valid === false) {
      // if(this.HQForm.get('vatNumber').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Ondernemingsnummer','');
      //   if(this.HQForm.get('firstname').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Naam','');
      //   if(this.HQForm.get('officialname').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Officiële naam','');
      //   if(this.HQForm.get('streetnumber').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Rechtsvorm','');
      //   if(this.HQForm.get('street').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Straat','');
      //   if(this.HQForm.get('city').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Nr','');
      //   if(this.HQForm.get('postalcode').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Plaats','');
      //   if(this.HQForm.get('phonenumber').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Postcode','');
      //   if(this.HQForm.get('invoiceEmail').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Telefoonnummer','');
      //   if(this.HQForm.get('contractsEmail').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Algemeen e-mail adres','');
      //   if(this.HQForm.get('generalEmail').invalid === true)
      //   this.logger.ShowMessage('Onjuiste invoer in invoerveld Facturatie e-mail adres','');
    }

    if (this.HQForm.valid === true && !this.emptyData())
      return true;

    return false;
  }

  emptyData() {

    if (this.HQForm.get('vatNumber').value === '')
      return true;
    if (this.HQForm.get('firstname').value === '')
      return true;
    if (this.HQForm.get('officialname').value === '')
      return true;
    if (this.HQForm.get('street').value === '')
      return true;
    if (this.HQForm.get('streetnumber').value === '')
      return true;
    if (this.HQForm.get('city').value === '')
      return true;
    if (this.HQForm.get('postalcode').value === '')
      return true;
    if (this.HQForm.get('phonenumber').value === '')
      return true;
    if (this.HQForm.get('invoiceEmail').value === '')
      return true;
    if (this.HQForm.get('contractsEmail').value === '')
      return true;
    if (this.HQForm.get('generalEmail').value === '')
      return true;

    return false;

  }

  updateCustomer() {
    this.setCustomerObject();
  }

  setJsonDataObject() 
  {

    this.invoiceEmail = new EmailAddress();
    this.contractsEmail = new EmailAddress();

    // assigning emailaddress objects
    this.invoiceEmail.emailAddress = this.HQForm.get('invoiceEmail').value;
    this.contractsEmail.emailAddress = this.HQForm.get('contractsEmail').value;

    this.setInvoiceSettingsEmpty();
    this.setStatuteSettingArray();
  
    if (this.dpsCustomer !== null) {
      this.HQdata = {
        "customer": this.dpsCustomer.customer,
        "invoiceEmail": this.invoiceEmail,
        "contractsEmail": this.contractsEmail,
        "invoiceSettings": this.invoiceSettings,
        "bulkContractsEnabled": false,
        "statuteSettings": this.statuteSetting,
        "contact": this.HQFormData.data.contact,
        "activateContactAsUser": false,
        "formValid": this.validity()
      };
      this.sendDatatoHome(this.HQdata);
    }
    else
      this.HQdata = null;

  }

  updateData() {

    if(this.HQFormData !== null && this.HQFormData !== undefined)
    {
      if(this.HQFormData.data !== null && this.HQFormData.data !== undefined)
      {
        this.createObjectsEdit();
        this.updateDataEdit();
      }
    }
    else {
      this.createObjects();
    }

  }

  // post the json data
  updateDataEdit() {

      let data = {
        "customer": this.changeDpsCustomer.customer,
        "invoiceEmail": this.HQFormData.data.customer.invoiceEmail,
        "contractsEmail": this.HQFormData.data.customer.contractsEmail,
        "invoiceSettings": this.HQFormData.data.invoiceSettings,
        "bulkContractsEnabled": false,
        "statuteSettings": this.HQFormData.data.statuteSettings,
        "contact": this.HQFormData.data.contact,
        "activateContactAsUser": false,
        "formValid": true
      };

    this.childEvent.emit(data);
  }

  sendDatatoHome(data) {
    this.childEvent.emit(data);
  }

}
